import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TeamModule } from '@core/modules/team/team.module'

import { KeyResultProvider } from './key-result.provider'
import { KeyResultRepository } from './key-result.repository'

@Module({
  imports: [TypeOrmModule.forFeature([KeyResultRepository]), forwardRef(() => TeamModule)],
  providers: [KeyResultProvider],
  exports: [KeyResultProvider],
})
export class KeyResultModule {}
