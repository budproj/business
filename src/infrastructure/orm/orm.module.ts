import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { createTypeORMConfig } from '@config/typeorm/typeorm.factory'

import { TypeORMFactory } from './typeorm.factory'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(createTypeORMConfig)],
      useClass: TypeORMFactory,
    }),
  ],
})
export class ORMModule {}
