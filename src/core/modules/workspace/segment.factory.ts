import * as assert from 'assert'

import { KeyResultMode } from '@core/modules/key-result/enums/key-result-mode.enum'
import { ObjectiveMode } from '@core/modules/objective/enums/objective-mode.enum'
import { TeamScopeFactory } from '@core/modules/workspace/team-scope.factory'

import { ConditionBuilder } from './condition.builder'
import { TABLE_NAMES } from './constants'
import { Segment, SourceScope, SourceSegment } from './workspace.interface'

export type CycleSegmentParams = {
  isActive?: boolean
  startAfter?: Date
  startBefore?: Date
  endAfter?: Date
  endBefore?: Date
}

export type OkrMode = 'published' | 'completed' | 'draft' | 'deleted'

export type OkrType = 'personal' | 'shared' | 'both'

export type ObjectiveSegmentParams = {
  mode?: OkrMode[]
  type?: OkrType
  cycle: CycleSegmentParams
}

export type KeyResultSegmentParams = {
  mode?: OkrMode[]
  type?: OkrType
  createdAfter?: Date
  createdBefore?: Date
  objective: ObjectiveSegmentParams
}

export type KeyResultLatestCheckInSegmentParams = {
  createdAfter?: Date
  createdBefore?: Date
  keyResult: KeyResultSegmentParams
}

export type KeyResultLatestStatusSegmentParams = KeyResultLatestCheckInSegmentParams

export class SegmentFactory {
  private readonly teamScopeFactory = new TeamScopeFactory()

  constructor(private readonly source: SourceSegment) {}

  company(): SourceSegment {
    const teamScopeFactory = new TeamScopeFactory()

    const segmentName = 'segment_company'
    const rootName = `${segmentName}_for_${this.source.scope}`

    const sourceJoin = this.innerJoinSource({
      team_scope: `"${this.source.name}".${this.source.idColumn}`,
      team: `"${this.source.name}".${this.source.idColumn}`,
      cycle: `"${this.source.name}".${this.source.idColumn}`,
    })

    const rootCte = teamScopeFactory.ascendingRecursive(rootName, sourceJoin)

    return {
      scope: 'team_scope',
      idColumn: 'id',
      name: segmentName,
      cte: [
        rootCte,
        `
          "${segmentName}" AS (
            SELECT DISTINCT ON (r.id) r.*
            FROM "${rootName}" r
            WHERE r.parent_id IS NULL OR r.id = r.parent_id
          )
        `,
      ].join(', '),
      params: {},
      require: [],
    }
  }

  cycles({ isActive, startAfter, startBefore, endBefore, endAfter }: CycleSegmentParams): Segment {
    const name = 'segment_cycle'

    const companySegment = this.company()

    // Bypass source directly to company-level as cycles are company-wide
    const sourceJoin = this.innerJoinSource(
      {
        team_scope: 'c.team_id',
        team: 'c.team_id',
        cycle: 'c.id',
      },
      companySegment,
    )

    const [whereSql, whereParams] = new ConditionBuilder(name)
      .eq('c.active', isActive)
      .gteq('c.date_start', startAfter)
      .lteq('c.date_start', startBefore)
      .gteq('c.date_end', endAfter)
      .lteq('c.date_end', endBefore)
      .whereEvery()

    return {
      name,
      cte: `
        "${name}" AS (
          SELECT c.*
          FROM "${TABLE_NAMES.cycle}" c
          ${sourceJoin}
          ${whereSql}
        )
      `,
      params: whereParams,
      require: [companySegment],
    }
  }

  objectives({ mode, type = 'both', cycle }: ObjectiveSegmentParams): Segment {
    const name = 'segment_objective'

    const sourceJoin = this.innerJoinSource({
      team_scope: 'o.team_id',
      team: 'o.team_id',
      user: 'o.owner_id',
      cycle: 'o.cycle_id',
    })

    const modesMap: Record<OkrMode, ObjectiveMode> = {
      published: ObjectiveMode.PUBLISHED,
      completed: ObjectiveMode.COMPLETED,
      draft: ObjectiveMode.DRAFT,
      deleted: ObjectiveMode.DELETED,
    }

    const modesFilter = mode.map((mode) => modesMap[mode])

    const whereBuilder = new ConditionBuilder(name).in('o.mode', modesFilter)

    switch (type) {
      case 'personal':
        whereBuilder.isNull('o.team_id')
        break
      case 'shared':
        whereBuilder.isNotNull('o.team_id')
        break
      case 'both':
      default:
        break
    }

    const [whereSql, whereParams] = whereBuilder.whereEvery()

    // eslint-disable-next-line no-negated-condition
    const cycleSegment = this.source.scope !== 'cycle' ? this.cycles(cycle) : null
    const cycleSegmentJoin = cycleSegment ? `INNER JOIN "${cycleSegment.name}" c ON c.id = o.cycle_id` : ''

    return {
      name,
      cte: `
        "${name}" AS (
          SELECT o.*
          FROM "${TABLE_NAMES.objective}" o
          ${sourceJoin}
          ${cycleSegmentJoin}
          ${whereSql}
        )
      `,
      params: whereParams,
      require: cycleSegment ? [cycleSegment] : [],
    }
  }

  keyResults({ mode, type, createdAfter, createdBefore, objective }: KeyResultSegmentParams): Segment {
    const objectivesSegment = this.objectives(objective)

    const name = 'segment_key_result'

    const modesMap: Record<OkrMode, KeyResultMode> = {
      published: KeyResultMode.PUBLISHED,
      completed: KeyResultMode.COMPLETED,
      draft: KeyResultMode.DRAFT,
      deleted: KeyResultMode.DELETED,
    }

    const modesList = mode.map((mode) => modesMap[mode])

    const whereBuilder = new ConditionBuilder(name)
      .in('kr.mode', modesList)
      .gteq('kr.created_at', createdAfter)
      .lt('kr.created_at', createdBefore)

    switch (type) {
      case 'personal':
        whereBuilder.isNull('kr.team_id')
        break
      case 'shared':
        whereBuilder.isNotNull('kr.team_id')
        break
      case 'both':
      default:
        break
    }

    const [whereSql, whereParams] = whereBuilder.whereEvery()

    return {
      name,
      cte: `
        "${name}" AS (
          SELECT kr.*, o.cycle_id AS cycle_id
          FROM "${TABLE_NAMES.keyResult}" kr
          INNER JOIN "${objectivesSegment.name}" o ON kr.objective_id = o.id
          ${whereSql}
        )
      `,
      params: whereParams,
      require: [objectivesSegment],
    }
  }

  keyResultLatestCheckIns({ createdAfter, createdBefore, keyResult }: KeyResultLatestCheckInSegmentParams): Segment {
    const keyResultsSegment = this.keyResults(keyResult)

    const name = 'segment_key_result_latest_check_in'

    const [whereSql, whereParams] = new ConditionBuilder(name)
      .gteq('krck.created_at', createdAfter)
      .lt('krck.created_at', createdBefore)
      .whereEvery()

    return {
      name,
      cte: `
        "${name}" AS (
          SELECT DISTINCT ON (krck.key_result_id)
            krck.*,
            kr.objective_id AS objective_id,
            kr.cycle_id AS cycle_id,
            kr.team_id AS team_id
          FROM "${TABLE_NAMES.keyResultCheckIn}" krck
          INNER JOIN "${keyResultsSegment.name}" kr ON krck.key_result_id = kr.id
          ${whereSql}
          ORDER BY krck.key_result_id, krck.created_at DESC
        )
      `,
      params: whereParams,
      require: [keyResultsSegment],
    }
  }

  keyResultLatestStatus({ keyResult }: KeyResultLatestStatusSegmentParams): Segment {
    const keyResultsSegment = this.keyResults(keyResult)
    const latestCheckInSegment = this.keyResultLatestCheckIns({ keyResult })

    const name = 'segment_key_result_latest_status'

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
          WHERE kr.goal <> kr.initial_value
        )
      `,
      params: {},
      require: [keyResultsSegment, latestCheckInSegment],
    }
  }

  objectiveProgress(params: KeyResultLatestCheckInSegmentParams): Segment {
    const latestStatusSegment = this.keyResultLatestStatus(params)

    const name = 'segment_objective_progress'

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

  private innerJoinSource(foreignKeys: Partial<Record<SourceScope, string>>, source = this.source): string {
    const foreignKey = foreignKeys[source.scope]

    assert(foreignKey, `Sourcing from ${source.scope} is not supported for this segment (missing foreign key mapping)`)

    return `INNER JOIN "${source.name}" ON "${source.name}"."${source.idColumn}" = ${foreignKey}`
  }
}
