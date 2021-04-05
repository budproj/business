import { Field, Int, ObjectType } from '@nestjs/graphql'

import { PageInfoGraphQLObject } from './page-info.object'

@ObjectType('Metadata', {
  description:
    'This object contains relevant metadata information regarding our returned node list',
})
export class MetadataGraphQLObject {
  @Field(() => PageInfoGraphQLObject)
  public pageInfo: PageInfoGraphQLObject

  @Field(() => Int, {
    description: 'Defines how many nodes we have in the give response',
  })
  public count: number
}
