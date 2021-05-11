import { Field, ID, InterfaceType } from '@nestjs/graphql'

@InterfaceType('NodeInterface', {
  description: 'A node represents an unit in our edge list',
})
export abstract class NodeRelayGraphQLInterface {
  @Field(() => ID, { complexity: 0, description: 'The ID of this node' })
  public readonly id!: string

  @Field({ complexity: 0, description: 'The creation date of the entity' })
  public readonly createdAt!: Date
}
