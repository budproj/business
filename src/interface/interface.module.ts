import { Module } from '@nestjs/common'

import { GraphQLModule } from './graphql/graphql.module'

@Module({
  imports: [GraphQLModule],
})
export class InterfaceModule {}
