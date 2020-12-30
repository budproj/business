import { CONSTRAINT } from 'domain/constants'
import { UserDTO } from 'domain/user/dto'

export interface DomainServiceContext {
  constraint: CONSTRAINT
  user: UserDTO
}

export interface DomainServiceGetOptions {
  limit?: number
}
