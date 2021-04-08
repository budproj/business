import { ArgsType, Field } from '@nestjs/graphql'

import { Cadence } from '@core/modules/cycle/enums/cadence.enum'

import { CadenceGraphQLEnum } from '../../enums/cadence.enum'
import { NodeFiltersRequest } from '../node-filters.request'

@ArgsType()
export class CycleFiltersRequest extends NodeFiltersRequest {
  @Field(() => Boolean, {
    description: 'If this flag is true, it will only fetch active cycles',
    nullable: true,
  })
  public active?: boolean

  @Field(() => CadenceGraphQLEnum, {
    description: 'This key filters all queries to a given cadence',
    nullable: true,
  })
  public cadence?: Cadence
}
