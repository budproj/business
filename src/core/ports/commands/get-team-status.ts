import { TeamStatus } from '@core/modules/team/interfaces/team-status.interface'

import { Command } from './base.command'

type GetTeamStatusOptions = {
  active: boolean
}

const defaultStatusOptions: GetTeamStatusOptions = {
  active: true,
}

export class GetTeamStatusCommand extends Command<TeamStatus> {
  public async execute(
    teamID: string,
    options: GetTeamStatusOptions = defaultStatusOptions,
  ): Promise<TeamStatus> {
    return {} as any
  }
}
