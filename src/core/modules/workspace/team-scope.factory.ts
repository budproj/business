import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'

import { TABLE_NAMES } from './constants'

export type TeamScope<T extends Record<string, unknown> = Record<string, unknown>> = [
  name: string,
  cte: string,
  params: T,
]

export type DescendingFromTeamsOptions = {
  parentTeamIds: string[]
  includeParentTeams: boolean
}

export type DescendingFromTeamsScope = TeamScope<DescendingFromTeamsOptions>

export type AscendingFromTeamsParams = {
  childTeamIds: string[]
  includeOriginTeams: boolean
  rootsOnly: boolean
}

/**
 * @type {[string, string, AscendingQueryOptions]]} [table, cte, options]
 */
export type AscendingFromTeamsScope = TeamScope<AscendingFromTeamsParams>

export type AscendingFromUserParams = {
  userId: string
  rootsOnly: boolean
}

export type AscendingFromUserScope = TeamScope<AscendingFromUserParams>

export type BidirectionalScopeParams = Omit<AscendingFromTeamsParams | AscendingFromUserParams, 'rootsOnly'>

export type BidirectionalScope = TeamScope<BidirectionalScopeParams>

export class TeamScopeFactory {
  descendingRecursive(name: string, filter: string): string {
    return `
      "${name}" (id, name, level, is_root, parent_id, source_id)
      AS (
        SELECT "${TABLE_NAMES.team}".id, "${TABLE_NAMES.team}".name, 0, TRUE, "${TABLE_NAMES.team}".parent_id, "${TABLE_NAMES.team}".id
        FROM "${TABLE_NAMES.team}"
        ${filter}

        UNION ALL

        SELECT tn.id, tn.name, tt.level + 1, FALSE, tt.id, tt.source_id
        FROM "${TABLE_NAMES.team}" tn
        INNER JOIN "${name}" tt ON tn.parent_id = tt.id
      )
    `
  }

  descendingFromTeams({
    parentTeamIds = [],
    includeParentTeams = true,
  }: Partial<DescendingFromTeamsOptions> = {}): DescendingFromTeamsScope {
    const recursiveName = 'recursive_team_tree'
    const recursiveCte = this.descendingRecursive(
      recursiveName,
      `WHERE "${TABLE_NAMES.team}".id = ANY (:parentTeamIds)`,
    )

    const distinctName = 'team_tree'

    const distinctCte = `
      "${distinctName}" AS (
        SELECT DISTINCT ON (id) *
        FROM "${recursiveName}"
        WHERE (:includeParentTeams IS TRUE OR NOT (id = ANY(:parentTeamIds)))
      )
    `

    return [
      distinctName,
      [recursiveCte, distinctCte].join(', '),
      {
        includeParentTeams,
        parentTeamIds,
      },
    ]
  }

  descending([rootsTable, rootsQuery, rootsQueryOptions]: BidirectionalScope): BidirectionalScope {
    const descendingRecursiveName = 'recursive_team_tree'

    const descendingRecursiveCte = this.descendingRecursive(
      descendingRecursiveName,
      `INNER JOIN "${rootsTable}" ON "${rootsTable}".id = "${TABLE_NAMES.team}".id`,
    )

    const descendingDistinctName = 'team_tree'
    const descendingDistinctCte = `
      "${descendingDistinctName}" AS (
        SELECT DISTINCT ON (id) *
        FROM "${descendingRecursiveName}"
      )
    `

    return [
      descendingDistinctName,
      [rootsQuery, descendingRecursiveCte, descendingDistinctCte].join(', '),
      rootsQueryOptions,
    ]
  }

  ascendingRecursive(name: string, filter: string): string {
    return `
      "${name}" (id, name, level, is_leaf, parent_id, source_id)
      AS (
        SELECT "${TABLE_NAMES.team}".id, "${TABLE_NAMES.team}".name, 0, TRUE, "${TABLE_NAMES.team}".parent_id, "${TABLE_NAMES.team}".id
        FROM "${TABLE_NAMES.team}"
        ${filter}

        UNION ALL

        SELECT pn.id, pn.name, cn.level - 1, FALSE, pn.parent_id, cn.source_id
        FROM "${name}" cn
        INNER JOIN "${TABLE_NAMES.team}" pn ON pn.id = cn.parent_id AND cn.id <> pn.id
      )
    `
  }

  ascendingFromTeams({
    childTeamIds,
    includeOriginTeams = true,
    rootsOnly = false,
  }: Partial<AscendingFromTeamsParams> = {}): AscendingFromTeamsScope {
    const recursiveName = 'recursive_team_path_from_teams'

    const recursiveCte = this.ascendingRecursive(recursiveName, `WHERE "${TABLE_NAMES.team}".id = ANY(:childTeamIds)`)

    const distinctName = 'team_path'

    const cte = `
      "${distinctName}" AS (
        SELECT DISTINCT ON (id) *
        FROM "${recursiveName}"
        WHERE (:includeOriginTeams IS TRUE OR NOT (id = ANY(:childTeamIds)))
          AND (:rootsOnly IS FALSE OR parent_id IS NULL OR id = parent_id)
      )
    `

    return [
      distinctName,
      [recursiveCte, cte].join(', '),
      {
        childTeamIds,
        // Force includeOriginTeams if rootsOnly is true to avoid root nodes from being excluded if childTeamIds are root nodes already
        includeOriginTeams: includeOriginTeams || rootsOnly,
        rootsOnly,
      },
    ]
  }

  ascendingFromUser({ userId, rootsOnly = false }: AscendingFromUserParams): AscendingFromUserScope {
    const userSubquery = `SELECT tu.team_id AS id FROM "${TABLE_NAMES.team_users_user}" tu WHERE tu.user_id = :userId`

    const recursiveName = 'recursive_team_path_from_user'

    const recursiveCte = this.ascendingRecursive(recursiveName, `WHERE "${TABLE_NAMES.team}".id IN (${userSubquery})`)

    const distinctName = 'team_path'

    const cte = `
      "${distinctName}" AS (
        SELECT DISTINCT ON (id) *
        FROM "${recursiveName}"
        WHERE :rootsOnly IS FALSE OR parent_id IS NULL OR id = parent_id
      )
    `

    return [
      distinctName,
      [recursiveCte, cte].join(', '),
      {
        userId,
        rootsOnly,
      },
    ]
  }

  bidirectionalFromTeams(originTeamIds: string[]): BidirectionalScope {
    const rootsScope = this.ascendingFromTeams({
      childTeamIds: originTeamIds,
      includeOriginTeams: true,
      rootsOnly: true,
    })

    return this.descending(rootsScope)
  }

  bidirectionalFromUser(userId: string): BidirectionalScope {
    const rootsScope = this.ascendingFromUser({
      userId,
      rootsOnly: true,
    })

    return this.descending(rootsScope)
  }
}
