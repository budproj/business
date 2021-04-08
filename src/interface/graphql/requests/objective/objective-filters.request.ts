import { ArgsType } from '@nestjs/graphql'

import { NodeFiltersRequest } from '../node-filters.request'

@ArgsType()
export class ObjectiveFiltersRequest extends NodeFiltersRequest {}
