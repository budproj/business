import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { omit } from 'lodash'
import { Observable } from 'rxjs'

import { AppRequest } from 'app/types'
import { CompanyDTO } from 'domain/company/dto'
import { User } from 'domain/user/entities'
import UserService from 'domain/user/service'

@Injectable()
export class EnhanceWithBudUser implements NestInterceptor {
  private readonly logger = new Logger(EnhanceWithBudUser.name)

  constructor(private readonly userService: UserService) {}

  async intercept(rawContext: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
    const gqlContext = GqlExecutionContext.create(rawContext)
    const request: AppRequest = gqlContext.getContext().req

    const { teams, ...user }: User = await this.userService.getUserFromSubjectWithTeamRelation(
      request.user.token.sub,
    )
    const userTeams = await teams
    const userCompanies: Array<CompanyDTO['id']> = userTeams.map((team) => team.companyId)

    request.user = {
      ...request.user,
      ...omit(user, '__teams__'),
      companies: userCompanies,
      teams: userTeams,
    }

    this.logger.debug({
      requestUser: request.user,
      message: `Selected user with ID ${user.id} for current request`,
    })

    return next.handle()
  }
}
