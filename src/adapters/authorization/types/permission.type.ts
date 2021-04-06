import { Scope } from '@adapters/authorization/enums/scope.enum'

import { Policy } from './policy.type'

export type Permission = `${Policy}:${Scope}`
