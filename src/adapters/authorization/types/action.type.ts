import { Command } from '@adapters/authorization/enums/command.enum'
import { Resource } from '@adapters/authorization/enums/resource.enum'

export type Action = `${Resource}:${Command}`
