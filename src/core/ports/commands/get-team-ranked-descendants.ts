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
      SELECT query.*
      FROM
        (SELECT t.name,
                t.updated_at,
                t.owner_id,
                t.created_at,
                t.id,
                t.description,
                t.gender,
                t.parent_id,
                ts.is_outdated,
                ts.is_active,
                ts.progress,
                ts.confidence,
                ts.previous_progress,
                krlci.created_at AS latest_check_in_created_at,
                u.first_name,
                u.last_name,
                u.authz_sub,
                u.created_at AS user_created_at,
                u.updated_at AS user_updated_at,
                u.id AS user_id,
                ROW_NUMBER() OVER(PARTITION BY t.name
                  ORDER BY CASE
                    WHEN krlci.created_at IS NULL THEN 0
                    ELSE 1
                    END DESC, krlci.created_at DESC) num
        FROM team t
        INNER JOIN team_company tc ON t.id = tc.team_id
        LEFT JOIN key_result kr ON kr.team_id = tc.team_id
        LEFT JOIN key_result_latest_check_in krlci ON krlci.key_result_id = kr.id
        LEFT JOIN "user" u ON u.id = krlci.user_id 
        LEFT JOIN team_status ts ON ts.team_id = tc.team_id
        WHERE t.parent_id IS NOT NULL
          AND tc.company_id = $1) AS query
      WHERE num = 1
      ORDER BY coalesce(progress, 0) DESC
    `,
      [teamID],
    )

    const tacticalCycle = await this.core.entityManager.query(
      `
      SELECT date_start, date_end 
        FROM "cycle" c
        WHERE c.team_id = $1
          AND c.cadence = 'QUARTERLY'
          AND c.active = true
      `,
      [teamID],
    )

    console.log({ rows })

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
        status: {
          isOutdated: row.is_outdated ?? false,
          isActive: row.is_active ?? false,
          progress: row.progress ?? 0,
          confidence: row.confidence ?? -100,
          latestCheckIn:
            row.latest_check_in_created_at && row.first_name
              ? {
                  createdAt: row.latest_check_in_created_at,
                  user: {
                    fullName: row.first_name,
                  },
                }
              : undefined,
        },
        delta: {
          progress: (row.progress ?? 0) - (row.previous_progress ?? 0),
        },
        tacticalCycle: {
          dateStart: tacticalCycle[0].date_start,
          dateEnd: tacticalCycle[0].date_end,
        },
      })
    })
  }
}
