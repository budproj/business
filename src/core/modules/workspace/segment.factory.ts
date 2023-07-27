import { KeyResultMode } from '@core/modules/key-result/enums/key-result-mode.enum'
import { ObjectiveMode } from '@core/modules/objective/enums/objective-mode.enum'

import { Segment } from './workspace.interface'

export type CycleSegmentParams = {
  isActive?: boolean
  startAfter?: Date
  startBefore?: Date
  endAfter?: Date
  endBefore?: Date
}

export type ObjectiveSegmentParams = {
  mode?: ObjectiveMode[]
  cycle: CycleSegmentParams
}

export type KeyResultSegmentParams = {
  mode?: KeyResultMode[]
  createdAfter?: Date
  objective: ObjectiveSegmentParams
}

export type KeyResultLatestCheckInSegmentParams = {
  keyResult: KeyResultSegmentParams
}

export type KeyResultLatestStatusSegmentParams = KeyResultLatestCheckInSegmentParams

export class SegmentFactory {
  private readonly tables = {
    cycle: 'cycle',
    objective: 'objective',
    keyResult: 'key_result',
    keyResultCheckIn: 'key_result_check_in',
  }

  constructor(private readonly source: Segment) {}

  cycles({ isActive, startAfter, startBefore, endBefore, endAfter }: CycleSegmentParams): Segment {
    const name = 'cte_cycle'

    return {
      name,
      cte: `
        "${name}" AS (
          SELECT c.*
          FROM "${this.tables.cycle}" c
          INNER JOIN "${this.source.name}" tt ON tt.id = c.team_id
          WHERE (cast(:cycleIsActive AS BOOLEAN) IS NULL OR c.active = :cycleIsActive)
            AND (cast(:cycleStartAfter AS TIMESTAMP) IS NULL OR c.date_start >= :cycleStartAfter)
            AND (cast(:cycleStartBefore AS TIMESTAMP) IS NULL OR c.date_start <= :cycleStartBefore)
            AND (cast(:cycleEndAfter AS TIMESTAMP) IS NULL OR c.date_end >= :cycleEndAfter)
            AND (cast(:cycleEndBefore AS TIMESTAMP) IS NULL OR c.date_end <= :cycleEndBefore)
        )
      `,
      params: {
        cycleIsActive: isActive ?? null,
        cycleStartAfter: startAfter ?? null,
        cycleStartBefore: startBefore ?? null,
        cycleEndAfter: endAfter ?? null,
        cycleEndBefore: endBefore ?? null,
      },
      require: [],
    }
  }

  objectives({ mode, cycle }: ObjectiveSegmentParams): Segment {
    const name = 'cte_objective'

    return {
      name,
      cte: `
        "${name}" AS (
          SELECT o.*
          FROM "${this.tables.objective}" o
          INNER JOIN "${this.tables.cycle}" c ON c.id = o.cycle_id
          INNER JOIN "${this.source.name}" tt ON tt.id = o.team_id
          WHERE (cast(:objectiveMode AS objective_mode_enum[]) IS NULL OR o.mode = ANY(:objectiveMode))
            AND (cast(:cycleIsActive AS BOOLEAN) IS NULL OR c.active = :cycleIsActive)
            AND (cast(:cycleStartAfter AS TIMESTAMP) IS NULL OR c.date_start >= :cycleStartAfter)
            AND (cast(:cycleStartBefore AS TIMESTAMP) IS NULL OR c.date_start <= :cycleStartBefore)
            AND (cast(:cycleEndAfter AS TIMESTAMP) IS NULL OR c.date_end >= :cycleEndAfter)
            AND (cast(:cycleEndBefore AS TIMESTAMP) IS NULL OR c.date_end <= :cycleEndBefore)
        )
      `,
      params: {
        objectiveMode: mode ?? null,
        cycleIsActive: cycle.isActive ?? null,
        cycleStartAfter: cycle.startAfter ?? null,
        cycleStartBefore: cycle.startBefore ?? null,
        cycleEndAfter: cycle.endAfter ?? null,
        cycleEndBefore: cycle.endBefore ?? null,
      },
      require: [],
    }
  }

  keyResults({ mode, createdAfter, objective }: KeyResultSegmentParams): Segment {
    const objectivesSegment = this.objectives(objective)

    const name = 'cte_key_result'

    return {
      name,
      cte: `
        "${name}" AS (
          SELECT kr.*, o.cycle_id AS cycle_id
          FROM "${this.tables.keyResult}" kr
          INNER JOIN "${objectivesSegment.name}" o ON kr.objective_id = o.id
          WHERE (cast(:keyResultMode AS key_result_mode_enum[]) IS NULL OR kr.mode = ANY(:keyResultMode))
            AND (cast(:createdAfter AS TIMESTAMP) IS NULL OR kr.created_at >= :keyResultCreatedAfter)
        )
      `,
      params: {
        keyResultMode: mode ?? null,
        keyResultCreatedAfter: createdAfter ?? null,
      },
      require: [objectivesSegment],
    }
  }

  keyResultLatestCheckIns({ keyResult }: KeyResultLatestCheckInSegmentParams): Segment {
    const keyResultsSegment = this.keyResults(keyResult)

    const name = 'cte_key_result_latest_check_in'

    return {
      name,
      cte: `
        "${name}" AS (
          SELECT DISTINCT ON (krck.key_result_id)
            krck.*,
            kr.objective_id AS objective_id,
            kr.cycle_id AS cycle_id,
            kr.team_id AS team_id
          FROM "${this.tables.keyResultCheckIn}" krck
          INNER JOIN "${keyResultsSegment.name}" kr ON krck.key_result_id = kr.id
          ORDER BY krck.key_result_id, krck.created_at DESC
        )
      `,
      params: {},
      require: [keyResultsSegment],
    }
  }

  keyResultLatestStatus({ keyResult }: KeyResultLatestStatusSegmentParams): Segment {
    const keyResultsSegment = this.keyResults(keyResult)
    const latestCheckInSegment = this.keyResultLatestCheckIns({ keyResult })

    const name = 'cte_key_result_latest_status'

    return {
      name,
      cte: `
        "${name}" AS (
          SELECT krck.id AS check_in_id,
                 kr.id AS key_result_id,
                 kr.objective_id AS objective_id,
                 kr.cycle_id AS cycle_id,
                 kr.team_id AS team_id,
                 coalesce(krck.confidence, 100) AS confidence,
                 greatest(0, least(100, ((coalesce(krck.value, kr.initial_value) - kr.initial_value) * 100) / (kr.goal - kr.initial_value))) AS progress
          FROM "${keyResultsSegment.name}" kr
          LEFT JOIN "${latestCheckInSegment.name}" krck ON krck.key_result_id = kr.id
        )
      `,
      params: {},
      require: [keyResultsSegment, latestCheckInSegment],
    }
  }

  objectiveProgress(params: KeyResultLatestCheckInSegmentParams): Segment {
    const latestStatusSegment = this.keyResultLatestStatus(params)

    const name = 'cte_objective_progress'

    return {
      name,
      cte: `
        "${name}" AS (
          SELECT krs.objective_id AS objective_id,
                 krs.cycle_id AS cycle_id,
                 krs.team_id AS team_id,
                 min(krs.confidence) AS confidence,
                 avg(krs.progress) AS progress
          FROM "${latestStatusSegment.name}" krs
          GROUP BY 1, 2, 3
        )
      `,
      params: {},
      require: [latestStatusSegment],
    }
  }
}
