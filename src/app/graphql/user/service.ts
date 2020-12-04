import { Injectable } from '@nestjs/common'

import { RESOURCE } from 'app/authz/constants'
import GraphQLEntityService from 'app/graphql/service'
import { UserDTO } from 'domain/user/dto'
import DomainUserService from 'domain/user/service'

@Injectable()
class GraphQLUserService extends GraphQLEntityService<DomainUserService, UserDTO> {
  constructor(public readonly userDomain: DomainUserService) {
    super(RESOURCE.USER, userDomain)
  }
}

export default GraphQLUserService
