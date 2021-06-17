import { ArgsType, Field } from '@nestjs/graphql'

@ArgsType()
export class StatusRequest {
  @Field({
    description: 'Defines until with date we should look to define the status',
    nullable: true,
  })
  public readonly date?: Date
}
