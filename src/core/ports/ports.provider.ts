import { Injectable } from '@nestjs/common'

import { CommandFactory, CommandType } from './commands/command.factory'
import { Stopwatch } from "@lib/logger/pino.decorator";

@Injectable()
export class CorePortsProvider {
  constructor(private readonly commandFactory: CommandFactory) {}

  @Stopwatch()
  public async dispatchCommand<R>(type: CommandType, ...commandArguments: any[]): Promise<R> {
    const command = this.commandFactory.buildCommand<R>(type)

    return command.execute(...commandArguments)
  }
}
