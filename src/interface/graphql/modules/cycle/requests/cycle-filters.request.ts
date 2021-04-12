import { ArgsType, Field } from '@nestjs/graphql'

import { Cadence } from '@core/modules/cycle/enums/cadence.enum'
import { CadenceGraphQLEnum } from '@interface/graphql/enums/cadence.enum'
import { ConnectionFiltersRequest } from '@interface/graphql/requests/connection-filters.request'

@ArgsType()
export class CycleFiltersRequest extends ConnectionFiltersRequest {
  @Field(() => Boolean, {
    description: 'If this flag is true, it will only fetch active cycles',
    nullable: true,
  })
  public readonly active?: boolean

  @Field(() => CadenceGraphQLEnum, {
    description: 'This key filters all queries to a given cadence',
    nullable: true,
  })
  public readonly cadence?: Cadence
}
