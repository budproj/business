import { Injectable } from '@nestjs/common'
import { FindConditions } from 'typeorm'

import { ACTION, RESOURCE } from 'src/app/authz/constants'
import { AuthzUser } from 'src/app/authz/types'
import GraphQLEntityService from 'src/app/graphql/service'
import { KeyResultDTO } from 'src/domain/key-result/dto'
import { KeyResult } from 'src/domain/key-result/entities'
import { ProgressReport } from 'src/domain/key-result/report/progress/entities'
import DomainKeyResultService from 'src/domain/key-result/service'

@Injectable()
class GraphQLKeyResultReportService extends GraphQLEntityService<KeyResult, KeyResultDTO> {
  constructor(public readonly keyResultDomain: DomainKeyResultService) {
    super(RESOURCE.PROGRESS_REPORT, keyResultDomain)
  }

  async getOneReportWithActionScopeConstraint(
    selector: FindConditions<ProgressReport>,
    user: AuthzUser,
    action: ACTION = ACTION.READ,
  ) {
    const scopeConstraint = user.scopes[this.resource][action]

    return this.keyResultDomain.getOneReportWithConstraint(scopeConstraint, selector, user)
  }
}

export default GraphQLKeyResultReportService
