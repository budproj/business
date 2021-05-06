import { Module } from '@nestjs/common'

import { CoreModule } from '@core/core.module'

import { CommandFactory } from './commands/command.factory'
import { CorePortsProvider } from './ports.provider'

@Module({
  imports: [CoreModule],
  providers: [CorePortsProvider, CommandFactory],
  exports: [CorePortsProvider],
})
export class CorePortsModule {}
