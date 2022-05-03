import { ArgsType, Field } from '@nestjs/graphql'

import { ConfidenceTag } from '@adapters/confidence-tag/confidence-tag.enum'

import { KeyResultFiltersRequest } from '../../key-result/requests/key-result-filters.request'

@ArgsType()
export class UserKeyResultsRequest extends KeyResultFiltersRequest {
  @Field(() => Boolean, {
    nullable: true,
    defaultValue: true,
    description: 'A flag that defines if we should fetch only active key-results for this user',
  })
  public active?: boolean

  @Field(() => Boolean, {
    nullable: true,
    description:
      'A flag that defines if we should fetch only key-results that contains checkmarks of this user',
  })
  public hasUserCheckMarks?: boolean

  @Field(() => String, {
    description: 'Define the confidence of the key results',
    nullable: true,
  })
  public confidence?: ConfidenceTag
}
