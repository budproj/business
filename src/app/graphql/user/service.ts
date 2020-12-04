import { Injectable } from '@nestjs/common'

import { RESOURCE } from 'app/authz/constants'
import GraphQLEntityService from 'app/graphql/service'
import DomainUserService from 'domain/user/service'

@Injectable()
class GraphQLUserService extends GraphQLEntityService<DomainUserService> {
  constructor(public readonly userDomain: DomainUserService) {
    super(RESOURCE.USER, userDomain)
  }
}

export default GraphQLUserService
