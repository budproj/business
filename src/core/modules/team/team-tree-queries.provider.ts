import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'

import { Team } from '@core/modules/team/team.orm-entity'
import { TeamRepository } from '@core/modules/team/team.repository'

export type DescendingQueryOptions = {
  parentTeamIds: string[]
  includeParentTeams: boolean
}

/**
 * @type {[string, string, DescendingQueryOptions]]} [table, cte, options]
 */
export type DescendingQuery = [string, string, DescendingQueryOptions]

export type AscendingQueryOptions = {
  childTeamIds: string[]
  includeChildTeams: boolean
  rootsOnly: boolean
}

/**
 * @type {[string, string, AscendingQueryOptions]]} [table, cte, options]
 */
export type AscendingQuery = [string, string, AscendingQueryOptions]

// TODO: implement method
export type BidirectionalQueryOptions = {
  originTeamIds: string[]
}

// TODO: implement method
export type BidirectionalQuery = [string, string, AscendingQueryOptions]

@Injectable()
export class TeamTreeQueries {

  private readonly tableName: string

  constructor({ metadata }: TeamRepository) {
    this.tableName = metadata.tableName
  }

  descendingRecursive(name: string, filter: string): string {
    return `
      "${name}" (id, name, level, is_root, parent_id, source_id)
      AS (
        SELECT "${this.tableName}".id, "${this.tableName}".name, 0, TRUE, "${this.tableName}".parent_id, "${this.tableName}".id
        FROM "${this.tableName}"
        ${filter}

        UNION ALL

        SELECT tn.id, tn.name, tt.level + 1, FALSE, tt.id, tt.source_id
        FROM "${this.tableName}" tn
        INNER JOIN "${name}" tt ON tn.parent_id = tt.id
      )
    `
  }

  descendingDistinct({
    parentTeamIds,
    includeParentTeams = true,
  }: Partial<DescendingQueryOptions> = {}): DescendingQuery {
    const recursiveName = 'recursive_team_tree'
    const recursiveCte = this.descendingRecursive(recursiveName, `WHERE "${this.tableName}".id = ANY (:parentTeamIds)`)

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
        SELECT "${this.tableName}".id, "${this.tableName}".name, 0, TRUE, "${this.tableName}".parent_id, "${this.tableName}".id
        FROM "${this.tableName}"
        ${filter}

        UNION ALL

        SELECT pn.id, pn.name, cn.level - 1, FALSE, pn.parent_id, cn.source_id
        FROM "${name}" cn
        INNER JOIN "${this.tableName}" pn ON pn.id = cn.parent_id AND cn.id <> pn.id
      )
    `
  }

  ascendingDistinct({
    childTeamIds,
    includeChildTeams = true,
    rootsOnly,
  }: Partial<AscendingQueryOptions> = {}): AscendingQuery {
    const recursiveName = 'recursive_team_path'

    const recursiveCte = this.ascendingRecursive(recursiveName, `WHERE "${this.tableName}".id = ANY(:childTeamIds)`)

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

  bidirectionalQuery({ originTeamIds }: Partial<BidirectionalQueryOptions> = {}): BidirectionalQuery {
    const [rootsTable, rootsQuery, rootsQueryOptions] = this.ascendingDistinct({
      childTeamIds: originTeamIds,
      includeChildTeams: true,
      rootsOnly: true,
    })

    const descendingRecursiveName = 'recursive_team_tree'

    const descendingRecursiveCte = this.descendingRecursive(
      descendingRecursiveName,
      `INNER JOIN "${rootsTable}" ON "${rootsTable}".id = "${this.tableName}".id`,
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
