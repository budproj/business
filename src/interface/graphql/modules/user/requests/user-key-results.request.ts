import { ArgsType, Field } from '@nestjs/graphql'

import { KeyResultFiltersRequest } from '../../key-result/requests/key-result-filters.request'

@ArgsType()
export class UserKeyResultsRequest extends KeyResultFiltersRequest {
  @Field(() => Boolean, {
    nullable: true,
    defaultValue: true,
    description: 'A flag that defines if we should fetch only active key-results for this user',
  })
  public active?: boolean
}