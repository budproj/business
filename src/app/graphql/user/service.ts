import { Injectable } from '@nestjs/common'

import { RESOURCE } from 'app/authz/constants'
import GraphQLEntityService from 'app/graphql/service'
import { UserDTO } from 'domain/user/dto'
import { User } from 'domain/user/entities'
import DomainUserService from 'domain/user/service'

@Injectable()
class GraphQLUserService extends GraphQLEntityService<User, UserDTO> {
  constructor(public readonly userDomain: DomainUserService) {
    super(RESOURCE.USER, userDomain)
  }

  getUserFullName(user: UserDTO) {
    return this.userDomain.buildUserFullName(user)
  }
}

export default GraphQLUserService
