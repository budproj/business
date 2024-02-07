import { FindConditions } from 'typeorm'

import { CoreProvider } from '@core/core.provider'
import { GetOptions } from '@core/interfaces/get-options'
import { Status } from '@core/interfaces/status.interface'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { Team } from '@core/modules/team/team.orm-entity'
import { Command } from '@core/ports/commands/base.command'
import { CommandFactory } from '@core/ports/commands/command.factory'

export class GetTeamRankedDescendantsCommand extends Command<Team[]> {
  private readonly getTeamStatus: Command<Status>

  constructor(protected core: CoreProvider, protected factory: CommandFactory) {
    super(core, factory)

    this.getTeamStatus = this.factory.buildCommand<Status>('get-team-status')
  }

  public async execute(
    teamID: string,
    filters?: FindConditions<TeamInterface>,
    queryOptions?: GetOptions<TeamInterface>,
  ): Promise<Team[]> {
    const rows = await this.core.entityManager.query(
      `
      SELECT t.*
      FROM team t
      JOIN team_company tc ON t.id = tc.team_id
      LEFT JOIN team_status ts ON ts.team_id = tc.team_id
      WHERE t.parent_id IS NOT NULL AND tc.company_id = $1
      ORDER BY coalesce(progress, 0) DESC;
    `,
      [teamID],
    )

    return rows.map((row) => {
      return Object.assign(new Team(), {
        name: row.name,
        updatedAt: row.updated_at,
        ownerId: row.owner_id,
        createdAt: row.created_at,
        id: row.id,
        description: row.description,
        gender: row.gender,
        parentId: row.parent_id,
      })
    })
  }
}
