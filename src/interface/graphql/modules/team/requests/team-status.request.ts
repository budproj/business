import { ArgsType, Field } from '@nestjs/graphql'

import { CycleAttributesInput } from '@interface/graphql/modules/cycle/inputs/cycle-attributes.input'
import { StatusRequest } from '@interface/graphql/requests/status.request'

@ArgsType()
export class TeamStatusRequest extends StatusRequest {
  @Field(() => CycleAttributesInput, {
    description: 'Defines our cycle filters to use while fetching this team status',
    defaultValue: {
      active: true,
    },
  })
  public readonly cycleFilters!: CycleAttributesInput

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly date?: Date
}
