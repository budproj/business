import { ArgsType } from '@nestjs/graphql'

import { ConnectionFiltersRequest } from '@interface/graphql/requests/connection-filters.request'

@ArgsType()
export class TeamFlagsRequest extends ConnectionFiltersRequest {}
