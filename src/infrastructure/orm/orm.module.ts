import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TypeORMConfigModule } from '@config/typeorm/typeorm.module'

import { TypeORMFactory } from './typeorm.factory'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [TypeORMConfigModule],
      useClass: TypeORMFactory,
    }),
  ],
})
export class ORMModule {}
