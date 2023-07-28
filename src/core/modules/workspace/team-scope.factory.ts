import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'

import { TABLE_NAMES } from './constants'

export type TeamScope<T extends Record<string, unknown> = Record<string, unknown>> = [
  name: string,
  cte: string,
  params: T,
]

export type DescendingScopeOptions = {
  parentTeamIds: string[]
  includeParentTeams: boolean
}

export type DescendingScope = TeamScope<DescendingScopeOptions>

export type AscendingScopeParams = {
  childTeamIds: string[]
  includeChildTeams: boolean
  rootsOnly: boolean
}

/**
 * @type {[string, string, AscendingQueryOptions]]} [table, cte, options]
 */
export type AscendingScope = TeamScope<AscendingScopeParams>

// TODO: implement method
export type BidirectionalScopeParams = {
  originTeamIds: string[]
}

// TODO: implement method
export type BidirectionalScope = TeamScope<AscendingScopeParams>

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

  descendingDistinct({
    parentTeamIds,
    includeParentTeams = true,
  }: Partial<DescendingScopeOptions> = {}): DescendingScope {
    const recursiveName = 'recursive_team_tree'
    const recursiveCte = this.descendingRecursive(recursiveName, `WHERE "${TABLE_NAMES.team}".id = ANY (:parentTeamIds)`)

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
        includeParentTeams: Boolean(includeParentTeams),
        parentTeamIds: parentTeamIds ?? [],
      },
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

  ascendingDistinct({
    childTeamIds,
    includeChildTeams = true,
    rootsOnly,
  }: Partial<AscendingScopeParams> = {}): AscendingScope {
    const recursiveName = 'recursive_team_path'

    const recursiveCte = this.ascendingRecursive(recursiveName, `WHERE "${TABLE_NAMES.team}".id = ANY(:childTeamIds)`)

    const distinctName = 'team_path'

    const cte = `
      "${distinctName}" AS (
        SELECT DISTINCT ON (id) *
        FROM "${recursiveName}"
        WHERE (:includeChildTeams IS TRUE OR NOT (id = ANY(:childTeamIds)))
          AND (:rootsOnly IS FALSE OR parent_id IS NULL OR id = parent_id)
      )
    `

    return [
      distinctName,
      [recursiveCte, cte].join(', '),
      {
        childTeamIds,
        // Force includeChildTeams if rootsOnly is true to avoid root nodes from being excluded if childTeamIds are root nodes already
        includeChildTeams: Boolean(includeChildTeams) || Boolean(rootsOnly),
        rootsOnly: Boolean(rootsOnly),
      },
    ]
  }

  bidirectional({ originTeamIds }: Partial<BidirectionalScopeParams> = {}): BidirectionalScope {
    const [rootsTable, rootsQuery, rootsQueryOptions] = this.ascendingDistinct({
      childTeamIds: originTeamIds,
      includeChildTeams: true,
      rootsOnly: true,
    })

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
}
