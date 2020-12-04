import { RESOURCE, SCOPE } from 'app/authz/constants'
import { AuthzUser } from 'app/authz/types'
import { UserObject } from 'app/graphql/user'
import { DomainCompanyService } from 'domain/company'
import { DomainCycleService } from 'domain/cycle'
import { DomainKeyResultService } from 'domain/key-result'
import { DomainConfidenceReportService } from 'domain/key-result/report/confidence'
import { DomainProgressReportService } from 'domain/key-result/report/progress'
import { DomainObjectiveService } from 'domain/objective'
import { DomainTeamService } from 'domain/team'
import { DomainUserService } from 'domain/user'
import { DomainKeyResultViewService } from 'domain/user/view/key-result'

abstract class GraphQLEntityService<
  S extends
    | DomainUserService
    | DomainKeyResultViewService
    | DomainTeamService
    | DomainObjectiveService
    | DomainKeyResultService
    | DomainProgressReportService
    | DomainConfidenceReportService
    | DomainCycleService
    | DomainCompanyService
> {
  public readonly entityService: S
  public readonly resource: RESOURCE

  constructor(public readonly serviceResource: RESOURCE, public readonly domainEntityService: S) {
    this.resource = serviceResource
    this.entityService = domainEntityService
  }

  async getOneByIDWithScopeConstraint(id: UserObject['id'], user: AuthzUser) {
    const scopedConstrainedSelectors = {
      [SCOPE.ANY]: async () => this.entityService.getOneByID(id),
      [SCOPE.COMPANY]: async () => this.entityService.getOneByIDIfUserIsInCompany(id, user),
      [SCOPE.TEAM]: async () => this.entityService.getOneByIDIfUserIsInTeam(id, user),
      [SCOPE.OWNS]: async () => this.entityService.getOneByIDIfUserOwnsIt(id, user),
    }
    const scopeConstraint = user.scopes[this.resource]
    const constrainedSelector = scopedConstrainedSelectors[scopeConstraint]

    return constrainedSelector()
  }
}

export default GraphQLEntityService
