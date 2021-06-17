import { ArgsType, Field } from '@nestjs/graphql'

@ArgsType()
export class StatusRequest {
  @Field({
    description: 'Defines if it should use only active key-results while defining the team status',
    defaultValue: true,
  })
  public readonly active: boolean
}
