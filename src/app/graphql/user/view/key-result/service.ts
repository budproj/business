import { Injectable } from '@nestjs/common'

import { RESOURCE } from 'app/authz/constants'
import GraphQLEntityService from 'app/graphql/service'
import { KeyResultViewDTO } from 'domain/user/view/key-result/dto'
import { KeyResultView } from 'domain/user/view/key-result/entities'
import DomainKeyResultViewService from 'domain/user/view/key-result/service'

@Injectable()
class GraphQLKeyResultViewService extends GraphQLEntityService<KeyResultView, KeyResultViewDTO> {
  constructor(public readonly keyResultViewDomain: DomainKeyResultViewService) {
    super(RESOURCE.KEY_RESULT_VIEW, keyResultViewDomain)
  }
}

export default GraphQLKeyResultViewService
