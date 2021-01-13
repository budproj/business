import { Injectable } from '@nestjs/common'

import { RESOURCE } from 'src/app/authz/constants'
import GraphQLEntityService from 'src/app/graphql/service'
import { UserDTO } from 'src/domain/user/dto'
import { User } from 'src/domain/user/entities'
import DomainUserService from 'src/domain/user/service'

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
