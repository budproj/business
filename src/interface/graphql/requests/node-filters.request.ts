import { ConnectionArguments } from '@infrastructure/relay/interfaces/connection-arguments.interface'
import { ArgsType, Field, ID } from '@nestjs/graphql'

@ArgsType()
export class NodeFiltersRequest extends ConnectionArguments {
  @Field(() => ID, {
    description: 'The ID of the node you want to filter in your query',
    nullable: true,
  })
  public id?: string
}
