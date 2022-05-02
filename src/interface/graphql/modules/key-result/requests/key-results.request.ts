import { ArgsType } from '@nestjs/graphql'

import { KeyResultFiltersRequest } from '../../key-result/requests/key-result-filters.request'

@ArgsType()
export class KeyResultsRequest extends KeyResultFiltersRequest {}
