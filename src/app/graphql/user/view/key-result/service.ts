import { Injectable } from '@nestjs/common'

import { RESOURCE } from 'src/app/authz/constants'
import GraphQLEntityService from 'src/app/graphql/service'
import { KeyResultViewDTO } from 'src/domain/user/view/key-result/dto'
import { KeyResultView } from 'src/domain/user/view/key-result/entities'
import DomainKeyResultViewService from 'src/domain/user/view/key-result/service'

@Injectable()
class GraphQLKeyResultViewService extends GraphQLEntityService<KeyResultView, KeyResultViewDTO> {
  constructor(public readonly keyResultViewDomain: DomainKeyResultViewService) {
    super(RESOURCE.KEY_RESULT_VIEW, keyResultViewDomain)
  }
}

export default GraphQLKeyResultViewService
