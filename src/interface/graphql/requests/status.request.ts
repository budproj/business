import { ArgsType, Field } from '@nestjs/graphql'

@ArgsType()
export class StatusRequest {
  @Field({
    description: 'Defines until with date we should look to define the status',
    nullable: true,
  })
  public readonly date?: Date

  @Field({
    description: 'Defines if it should use only active key-results while defining the team status',
    defaultValue: true,
  })
  public readonly active!: boolean
}
