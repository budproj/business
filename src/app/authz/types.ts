import { CompanyDTO } from 'domain/company/dto'
import { TeamDTO } from 'domain/team/dto'
import { UserDTO } from 'domain/user/dto'

export interface AuthzToken {
  iss: string
  sub: string
  aud: string[]
  iat: number
  exp: number
  azp: string
  scope: string
  permissions: string[]
}

export interface AuthzUser extends UserDTO {
  token: AuthzToken
  companies: Array<CompanyDTO['id']>
  teams: TeamDTO[]
}
