import { CONSTRAINT } from 'src/domain/constants'
import { UserDTO } from 'src/domain/user/dto'

export interface DomainServiceContext {
  constraint: CONSTRAINT
  user: UserDTO
}

export interface DomainServiceGetOptions {
  limit?: number
}
