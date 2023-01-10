import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('UserProfileAmplitudeData', {
  description: 'An object continaing the amplitude data from the user',
})
export class UserProfileAmplitudeDataObject {
  @Field({
    nullable: true,
  })
  public readonly last_used?: string
}
