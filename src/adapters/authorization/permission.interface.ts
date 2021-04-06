import { Scope } from './enums/scope.enum'
import { Policy } from './policy.interface'

export type Permission = `${Policy}:${Scope}`
