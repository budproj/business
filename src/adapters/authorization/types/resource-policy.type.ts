import { Resource } from '@adapters/authorization/enums/resource.enum'

import { CommandPolicy } from './command-policy.type'

export type ResourcePolicy = Record<Resource, CommandPolicy>
