import { Module } from '@nestjs/common'

import { GraphQLAdapterModule } from './adapters/graphql/graphql.module'

@Module({
  imports: [GraphQLAdapterModule],
})
export class InterfaceModule {}
