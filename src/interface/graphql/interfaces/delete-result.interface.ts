import { Field, Int, InterfaceType } from '@nestjs/graphql'

@InterfaceType('DeleteResult', {
  description: 'The delete result from a delete mutation',
})
export abstract class DeleteResultGraphQLInterface {
  @Field(() => Int, { complexity: 0, description: 'The amount of entities removed' })
  public affected!: number
}
