import { Injectable } from '@nestjs/common'

import { CommandFactory, CommandType } from './commands/command.factory'

@Injectable()
export class CorePortsProvider {
  constructor(private readonly commandFactory: CommandFactory) {}

  public async dispatchCommand<R>(type: CommandType, ...commandArguments: any[]): Promise<R> {
    const command = this.commandFactory.buildCommand<R>(type)
    const result = await command.execute(...commandArguments)

    return result
  }
}
