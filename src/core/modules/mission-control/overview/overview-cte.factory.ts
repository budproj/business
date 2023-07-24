import { KeyResultMode } from '@core/modules/key-result/enums/key-result-mode.enum'

export type OverviewCte = {
  name: string
  cte: string
  params: Record<string, unknown>
  require: OverviewCte[]
}

export type OverviewObjectiveQueryParams = {
  cycleIsActive?: boolean
  // TODO: filter by mode
}

export type OverviewKeyResultQueryParams = {
  cycleIsActive?: boolean
  mode?: KeyResultMode[]
}

export type OverviewKeyResultLatestCheckInQueryParams = {
  cycleIsActive?: boolean
  mode?: KeyResultMode[]
}

export class OverviewCteFactory {
  private readonly tables = {
    cycle: 'cycle',
    objective: 'objective',
    keyResult: 'key_result',
    keyResultCheckIn: 'key_result_check_in',
  }

  constructor(private readonly source: OverviewCte) {}

  // TODO: user teams

  objectives({ cycleIsActive }: OverviewObjectiveQueryParams): OverviewCte {
    const name = 'cte_objective'

    // TODO: add date filters
    return {
      name,
      cte: `
        "${name}" AS (
          SELECT o.*
          FROM "${this.tables.objective}" o
          INNER JOIN "${this.source.name}" tt ON tt.id = o.team_id
          INNER JOIN "${this.tables.cycle}" c ON c.id = o.cycle_id
          WHERE (cast(:cycleIsActive AS BOOLEAN) IS NULL OR c.active = :cycleIsActive)
        )
      `,
      params: {
        cycleIsActive: cycleIsActive ?? null,
      },
      require: [],
    }
  }

  keyResults({ cycleIsActive, mode }: OverviewKeyResultQueryParams): OverviewCte {
    const objectivesQuery = this.objectives({ cycleIsActive })

    const name = 'cte_key_result'

    // TODO: add date filters
    return {
      name,
      cte: `
        "${name}" AS (
          SELECT kr.*
          FROM "${this.tables.keyResult}" kr
          INNER JOIN "${objectivesQuery.name}" o ON kr.objective_id = o.id
          WHERE (cast(:mode AS key_result_mode_enum[]) IS NULL OR kr.mode = ANY(:mode))
        )
      `,
      params: {
        mode: mode ?? null,
      },
      require: [objectivesQuery],
    }
  }

  keyResultLatestCheckIns({ cycleIsActive, mode }: OverviewKeyResultLatestCheckInQueryParams): OverviewCte {
    const keyResultsQuery = this.keyResults({ cycleIsActive, mode })

    const name = 'cte_key_result_latest_check_in'

    // TODO: add date filters
    return {
      name,
      cte: `
        "${name}" AS (
          SELECT DISTINCT ON (krck.key_result_id) kr.id, krck.*
          FROM "${this.tables.keyResultCheckIn}" krck
          INNER JOIN "${keyResultsQuery.name}" kr ON krck.key_result_id = kr.id
          ORDER BY krck.key_result_id, krck.created_at DESC
        )
      `,
      params: {},
      require: [keyResultsQuery],
    }
  }
}
