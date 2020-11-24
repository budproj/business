import { Logger, UseGuards } from '@nestjs/common'
import { Args, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { Permissions } from 'app/authz/decorators'
import { GraphQLAuthGuard, PermissionsGuard } from 'app/authz/guards'
import { KeyResultDTO } from 'domain/key-result/dto'
import KeyResultService from 'domain/key-result/service'
import ObjectiveService from 'domain/objective/service'
import TeamService from 'domain/team/service'
import UserService from 'domain/user/service'

import { KeyResult } from './models'

@UseGuards(GraphQLAuthGuard, PermissionsGuard)
@Resolver(() => KeyResult)
class KeyResultResolver {
  private readonly logger = new Logger(KeyResultResolver.name)

  constructor(
    private readonly keyResultService: KeyResultService,
    private readonly userService: UserService,
    private readonly objectiveService: ObjectiveService,
    private readonly teamService: TeamService,
  ) {}

  @Permissions('read:key-results')
  @Query(() => KeyResult)
  async keyResult(@Args('id', { type: () => Int }) id: number) {
    this.logger.log(`Fetching key result with id ${id.toString()}`)

    return this.keyResultService.getOneById(id)
  }

  @ResolveField()
  async owner(@Parent() keyResult: KeyResultDTO) {
    this.logger.log({
      keyResult,
      message: 'Fetching owner for key result',
    })

    return this.userService.getOneById(keyResult.ownerId)
  }

  @ResolveField()
  async objective(@Parent() keyResult: KeyResultDTO) {
    this.logger.log({
      keyResult,
      message: 'Fetching objective for key result',
    })

    return this.objectiveService.getOneById(keyResult.objectiveId)
  }

  @ResolveField()
  async team(@Parent() keyResult: KeyResultDTO) {
    this.logger.log({
      keyResult,
      message: 'Fetching team for key result',
    })

    return this.teamService.getOneById(keyResult.teamId)
  }
}

export default KeyResultResolver
