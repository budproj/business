import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('UserReportProgressObject', {
  description:
    'An object continaing the progress of a user in a specific cycle type and rather to show it or not',
})
export class UserReportProgressObject {
  @Field()
  public readonly showProgress: boolean

  @Field()
  public readonly progress: number
}
