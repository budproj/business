import { Team } from '@core/modules/team/team.orm-entity'

import { Command } from './base.command'

export class GetTeamProgressWithChildren extends Command<number> {
  public async execute(team: Partial<Team>): Promise<number> {
    const result = await this.core.entityManager.query(
      `
        WITH RECURSIVE team_hierarchy AS (
          SELECT id
          FROM team
          WHERE id = $1
          UNION ALL
          SELECT t.id
          FROM team t
          INNER JOIN team_hierarchy th ON t.parent_id = th.id
        )
        SELECT 
          SUM(ts.progress) AS total_progress,
          COUNT(ts.team_id) AS team_count
        FROM team_current_status ts
        INNER JOIN team_hierarchy th ON ts.team_id = th.id
      `,
      [team.id],
    )

    console.log({ result })

    const totalProgress = result[0].total_progress
    const teamCount = result[0].team_count

    console.log({ totalProgress })
    console.log({ teamCount })

    return totalProgress / teamCount
  }
}
