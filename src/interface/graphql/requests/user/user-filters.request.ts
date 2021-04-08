import { ArgsType } from '@nestjs/graphql'

import { NodeFiltersRequest } from '../node-filters.request'

@ArgsType()
export class UserFiltersRequest extends NodeFiltersRequest {}
