import { Scope } from '../enums/scope.enum'

import { Action } from './action.type'

export type Permission = `${Action}:${Scope}`
