import { CoreProvider } from '@core/core.provider'

import { Port } from '../base.interface'

export abstract class Command<R> implements Port<R> {
  static type: string

  constructor(protected readonly core: CoreProvider) {}

  public abstract execute(...commandArguments: any[]): Promise<R>
}
