import { Resource } from '@adapters/authorization/enums/resource.enum'

import { ActionStatement } from './action-statement.type'

export type ResourceStatement = Record<Resource, ActionStatement>
