import { Command } from '../enums/command.enum'
import { Resource } from '../enums/resource.enum'

export type Action = `${Resource}:${Command}`
