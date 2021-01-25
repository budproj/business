import { Injectable } from '@nestjs/common'

import { RESOURCE } from 'src/app/authz/constants'
import GraphQLEntityService from 'src/app/graphql/service'
import { KeyResultCustomList } from 'src/domain/key-result/custom-list/entities'
import { KeyResultCustomListDTO } from 'src/domain/key-result/custom-list/dto'
import DomainKeyResultCustomListService from 'src/domain/key-result/custom-list/service'

@Injectable()
class GraphQLKeyResultCustomListService extends GraphQLEntityService<
  KeyResultCustomList,
  KeyResultCustomListDTO
> {
  constructor(public readonly keyResultCustomListDomain: DomainKeyResultCustomListService) {
    super(RESOURCE.KEY_RESULT_VIEW, keyResultCustomListDomain)
  }
}

export default GraphQLKeyResultCustomListService
