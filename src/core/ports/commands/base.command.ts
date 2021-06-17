import { CoreProvider } from '@core/core.provider'
import { CommandFactory } from '@core/ports/commands/command.factory'

import { Port } from '../base.interface'

export abstract class Command<R> implements Port<R> {
  constructor(protected readonly core: CoreProvider, protected readonly factory: CommandFactory) {}

  public abstract execute(...commandArguments: any[]): Promise<R>
}
