import { Injectable } from '@nestjs/common'

import { TABLE_NAMES } from './constants'
import { TeamScope } from './team-scope.factory'
import { SourceScope, SourceSegment } from './workspace.interface'

type BuildSourceArgs = {
  scope: SourceScope
  idColumn: string
  ids: string[]
  table: string
}

@Injectable()
export class SourceSegmentFactory {
  fromTeamScope([name, cte, params]: TeamScope): SourceSegment {
    return {
      scope: 'team_scope',
      idColumn: 'id',
      name,
      cte,
      params,
      require: [],
    }
  }

  fromTeams(teamIds: string[]): SourceSegment {
    return this.buildSource({
      scope: 'team',
      idColumn: 'id',
      ids: teamIds,
      table: TABLE_NAMES.team,
    })
  }

  fromUsers(userIds: string[]): SourceSegment {
    return this.buildSource({
      scope: 'user',
      idColumn: 'id',
      ids: userIds,
      table: TABLE_NAMES.user,
    })
  }

  fromCycles(cycleIds: string[]): SourceSegment {
    return this.buildSource({
      scope: 'cycle',
      idColumn: 'id',
      ids: cycleIds,
      table: TABLE_NAMES.cycle,
    })
  }

  private buildSource({ scope, idColumn, ids, table }: BuildSourceArgs): SourceSegment {
    const idsParam = `from${table}Ids`
    const name = `source_${table}`
    const cte = `"${name}" AS (SELECT * FROM "${table}" WHERE "${idColumn}" = ANY(:${idsParam}))`

    return {
      scope,
      idColumn,
      name,
      cte,
      params: { [idsParam]: ids },
      require: [],
    }
  }
}
