import { ArgsType } from '@nestjs/graphql'

import { NodeFiltersRequest } from '@interface/graphql/requests/node-filters.request'

@ArgsType()
export class UserFiltersRequest extends NodeFiltersRequest {}