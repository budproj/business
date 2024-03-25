import {
  ForbiddenException,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common'
import { Args, Parent, ResolveField } from '@nestjs/graphql'
import { UserInputError } from 'apollo-server-fastify'
import { Role } from 'auth0'
import { FileUpload } from 'graphql-upload'
import { intersection } from 'lodash'

import { Resource } from '@adapters/policy/enums/resource.enum'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { VisibilityStorageEnum } from '@adapters/storage/enums/visilibity.enum'
import { CoreProvider } from '@core/core.provider'
import { KeyResultCheckInInterface } from '@core/modules/key-result/check-in/key-result-check-in.interface'
import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'
import { KeyResultCommentInterface } from '@core/modules/key-result/comment/key-result-comment.interface'
import { KeyResultComment } from '@core/modules/key-result/comment/key-result-comment.orm-entity'
import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { ObjectiveInterface } from '@core/modules/objective/interfaces/objective.interface'
import { Objective } from '@core/modules/objective/objective.orm-entity'
import { TaskInterface } from '@core/modules/task/task.interface'
import { Task } from '@core/modules/task/task.orm-entity'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { Team } from '@core/modules/team/team.orm-entity'
import { EmailAlreadyExistsException } from '@core/modules/user/exceptions/email-already-exists.exception'
import { Key } from '@core/modules/user/setting/user-setting.enums'
import { UserSettingInterface } from '@core/modules/user/setting/user-setting.interface'
import { UserSetting } from '@core/modules/user/setting/user-settings.orm-entity'
import { UserInterface, UserReportProgress } from '@core/modules/user/user.interface'
import { User } from '@core/modules/user/user.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'
import { UserAmplitudeDataProperties } from '@infrastructure/amplitude/types/user-profile.data'
import { AWSS3Provider } from '@infrastructure/aws/s3/s3.provider'
import { GuardedMutation } from '@interface/graphql/adapters/authorization/decorators/guarded-mutation.decorator'
import { GuardedQuery } from '@interface/graphql/adapters/authorization/decorators/guarded-query.decorator'
import { GuardedResolver } from '@interface/graphql/adapters/authorization/decorators/guarded-resolver.decorator'
import { GuardedNodeGraphQLResolver } from '@interface/graphql/adapters/authorization/resolvers/guarded-node.resolver'
import { RequestUserWithContext } from '@interface/graphql/adapters/context/decorators/request-user-with-context.decorator'
import { UploadGraphQLProvider } from '@interface/graphql/adapters/upload/upload.provider'
import { KeyResultCheckInFiltersRequest } from '@interface/graphql/modules/key-result/check-in/requests/key-result-check-in-filters.request'
import { KeyResultCommentFiltersRequest } from '@interface/graphql/modules/key-result/comment/requests/key-result-comment-filters.request'
import { ObjectiveFiltersRequest } from '@interface/graphql/modules/objective/requests/objective-filters.request'
import { TeamFiltersRequest } from '@interface/graphql/modules/team/requests/team-filters.request'
import { UserSettingsGraphQLConnection } from '@interface/graphql/modules/user/connections/user-user-settings/user-user-settings.connection'
import { UserSettingFiltersRequest } from '@interface/graphql/modules/user/setting/requests/user-setting-filters.request'
import { UserAccessControl } from '@interface/graphql/modules/user/user.access-control'
import { NodeIndexesRequest } from '@interface/graphql/requests/node-indexes.request'
import { Cacheable } from '@lib/cache/cacheable.decorator'
import { Stopwatch } from '@lib/logger/pino.decorator'
import { Permission as UserPermission } from 'src/adapters/policy/types/permission.type'

import { UserKeyResultCheckInsGraphQLConnection } from './connections/user-key-result-check-ins/user-key-result-check-ins.connection'
import { UserKeyResultCommentsGraphQLConnection } from './connections/user-key-result-comments/user-key-result-comments.connection'
import { UserKeyResultsGraphQLConnection } from './connections/user-key-results/user-key-results.connection'
import { UserObjectivesGraphQLConnection } from './connections/user-objectives/user-objectives.connection'
import { UserTasksGraphQLConnection } from './connections/user-tasks/user-tasks.connection'
import { UserTeamsGraphQLConnection } from './connections/user-teams/user-teams.connection'
import { EmailAlreadyExistsApolloError } from './exceptions/email-already-exists.exception'
import { UserProfileAmplitudeDataObject } from './objects/user-amplitude-data-object'
import { UserIndicatorsObject } from './objects/user-indicators.object'
import { UserReportProgressObject } from './objects/user-report-progress.object'
import { UserRoleObject } from './objects/user-role-object'
import { UserCreateRequest } from './requests/user-create.request'
import { UserDeactivateAndReactivateRequest } from './requests/user-deactivate-and-reactivate.request'
import { UserKeyResultsRequest } from './requests/user-key-results.request'
import { UserRquest } from './requests/user-request.request'
import { UserUpdateRoleRequest } from './requests/user-update-role.request'
import { UserUpdateRequest } from './requests/user-update.request'
import { UserTasksRequest } from './task/requests/user-tasks.request'
import { UserGraphQLNode } from './user.node'

@GuardedResolver(UserGraphQLNode)
export class UserGraphQLResolver extends GuardedNodeGraphQLResolver<User, UserInterface> {
  private readonly logger = new Logger(UserGraphQLResolver.name)
  private readonly uploadProvider: UploadGraphQLProvider

  constructor(
    protected readonly core: CoreProvider,
    protected accessControl: UserAccessControl,
    private readonly corePorts: CorePortsProvider,
    awsS3: AWSS3Provider,
  ) {
    super(Resource.USER, core, core.user, accessControl)

    this.uploadProvider = new UploadGraphQLProvider(awsS3)
  }

  @Cacheable((request, user) => [user.id, request], 1 * 60)
  @Stopwatch()
  @GuardedQuery(UserGraphQLNode, 'user:read', { name: 'user' })
  protected async getUserForRequestAndRequestUserWithContext(
    @Args() request: NodeIndexesRequest,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    this.logger.log({
      request,
      message: 'Fetching user with provided indexes',
    })

    const user = await this.queryGuard.getOneWithActionScopeConstraint(request, userWithContext)
    if (!user) throw new UserInputError(`We could not found an user with the provided arguments`)

    return user
  }

  @Cacheable('0.id', 1 * 60)
  @Stopwatch()
  @GuardedQuery(UserGraphQLNode, 'user:read', { name: 'me' })
  protected async getMyUserForRequestUserWithContext(
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    this.logger.log(
      `Fetching data about the user that is executing the request. Provided user ID: ${userWithContext.id}`,
    )

    const user = await this.queryGuard.getOneWithActionScopeConstraint(
      { id: userWithContext.id },
      userWithContext,
    )
    if (!user) throw new UserInputError(`We could not found an user with ID ${userWithContext.id}`)

    return user
  }

  @GuardedMutation(UserGraphQLNode, 'user:update', { name: 'updateUser' })
  protected async updateUserForRequestAndRequestUserWithContext(
    @Args() request: UserUpdateRequest,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    const canUpdate = await this.accessControl.canUpdate(userWithContext, request.id)
    if (!canUpdate) throw new UnauthorizedException()

    this.logger.log({
      userWithContext,
      request,
      message: 'Received update user request',
    })

    const picture = await this.parseUserPictureFileToRemoteURL(request.data.picture)
    const newData = picture
      ? {
          ...request.data,
          picture,
        }
      : { ...request.data }

    try {
      const user = await this.corePorts.dispatchCommand<User>('update-user', request.id, newData)
      if (!user) throw new UserInputError(`We could not found an user with ID ${request.id}`)

      return user
    } catch (catchedError: unknown) {
      const error =
        catchedError instanceof EmailAlreadyExistsException
          ? new EmailAlreadyExistsApolloError(catchedError.message)
          : catchedError

      throw error
    }
  }

  @GuardedMutation(UserGraphQLNode, 'user:delete', { name: 'deactivateUser' })
  protected async deactivateUserForRequestAndRequestUserWithContext(
    @Args() request: UserDeactivateAndReactivateRequest,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    const canDelete = await this.accessControl.canDelete(userWithContext, request.id)
    if (!canDelete) throw new UnauthorizedException()

    this.logger.log({
      userWithContext,
      request,
      message: 'Received deactivate user request',
    })

    return this.corePorts.dispatchCommand<User>('deactivate-user', request.id)
  }

  @GuardedMutation(UserGraphQLNode, 'user:delete', { name: 'reactivateUser' })
  protected async reactivateUserForRequestAndRequestUserWithContext(
    @Args() request: UserDeactivateAndReactivateRequest,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    const canDelete = await this.accessControl.canDelete(userWithContext, request.id)
    if (!canDelete) throw new UnauthorizedException()

    this.logger.log({
      userWithContext,
      request,
      message: 'Received reactivate user request',
    })

    return this.corePorts.dispatchCommand<User>('reactivate-user', request.id)
  }

  @GuardedMutation(UserGraphQLNode, 'user:create', { name: 'createUser' })
  protected async createUserForRequestAndRequestUserWithContext(
    @Args() request: UserCreateRequest,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    const { teamID, locale, ...newUserData } = request.data

    const canCreate = await this.accessControl.canCreate(userWithContext, teamID)
    if (!canCreate) throw new UnauthorizedException()

    this.logger.log({
      userWithContext,
      request,
      message: 'Received create user request',
    })

    const createdUser = await this.corePorts.dispatchCommand<User>('create-user', newUserData, {
      autoInvite: !locale,
    })
    if (!createdUser) throw new InternalServerErrorException('We were not able to create your user')

    await this.corePorts.dispatchCommand('add-team-to-user', { teamID, userID: createdUser.id })

    if (locale) {
      await this.corePorts.dispatchCommand<UserSetting>(
        'update-user-setting',
        createdUser.id,
        Key.LOCALE,
        locale,
      )

      await this.corePorts.dispatchCommand('invite-user', createdUser.id, createdUser.email)
    }

    return createdUser
  }

  @GuardedMutation(UserGraphQLNode, 'user:update', { name: 'updateUserRole', nullable: true })
  protected async updateUserRoleForRequestAndRequestUserWithContext(
    @Args() request: UserUpdateRoleRequest,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    const permissionsArray: UserPermission[] = ['user:update:any', 'user:update:company']
    const canUpdate = intersection(userWithContext.token.permissions, permissionsArray).length > 0
    if (!canUpdate) throw new UnauthorizedException()

    this.logger.log({
      userWithContext,
      request,
      message: 'Received update user role request',
    })

    await this.corePorts.dispatchCommand<User>('update-user-role', request.id, request.role)
    return this.corePorts.dispatchCommand<User>('get-user', request.id)
  }

  @GuardedMutation(UserGraphQLNode, 'user:update', {
    name: 'requestChangeUserPasswordEmail',
    nullable: true,
  })
  protected async requestChangeUserPasswordEmailForRequestAndRequestUserWithContext(
    @Args() request: UserRquest,
  ) {
    this.logger.log({
      request,
      message: 'Received update user role request',
    })

    await this.corePorts.dispatchCommand<User>('request-change-user-password-email', request.id)
  }

  // Precisamos por esse nome para este resolvefield por causa da existência do campo "role", da tabela de usuário
  @Cacheable('0.id', 5 * 60)
  @Stopwatch()
  @ResolveField('authzRole', () => UserRoleObject)
  protected async getRoleForUser(@Parent() user: UserGraphQLNode) {
    this.logger.log({
      user,
      message: 'Fetching user role',
    })

    return this.corePorts.dispatchCommand<Role>('get-user-role', user.id)
  }

  @ResolveField('fullName', () => String)
  protected async getFullNameForUser(@Parent() user: UserGraphQLNode) {
    this.logger.log({
      user,
      message: 'Fetching user full name',
    })

    return this.core.user.buildUserFullName(user)
  }

  @Cacheable((request, user) => [user.id, request], 1 * 60)
  @Stopwatch()
  @ResolveField('companies', () => UserTeamsGraphQLConnection, { nullable: true })
  protected async getCompaniesForRequestAndUser(
    @Args() request: TeamFiltersRequest,
    @Parent() user: UserGraphQLNode,
  ) {
    this.logger.log({
      user,
      request,
      message: 'Fetching companies for user',
    })

    const [filters, queryOptions, connection] = this.relay.unmarshalRequest<
      TeamFiltersRequest,
      Team
    >(request)

    const userCompanies = await this.core.team.getUserCompanies(user, filters, queryOptions)
    return this.relay.marshalResponse<Team>(userCompanies, connection, user)
  }

  @Cacheable((request, user) => [user.id, request], 1 * 60)
  @Stopwatch()
  @ResolveField('teams', () => UserTeamsGraphQLConnection, { nullable: true })
  protected async getTeamsForRequestAndUser(
    @Args() request: TeamFiltersRequest,
    @Parent() user: UserGraphQLNode,
  ) {
    this.logger.log({
      user,
      request,
      message: 'Fetching teams for user',
    })

    const [filters, queryOptions, connection] = this.relay.unmarshalRequest<
      TeamFiltersRequest,
      Team
    >(request)

    const queryResult = await this.core.user.getUserTeams(user, filters, queryOptions)

    return this.relay.marshalResponse<TeamInterface>(queryResult, connection, user)
  }

  @Cacheable((request, user) => [user.id, request], 1 * 60)
  @Stopwatch()
  @ResolveField('ownedTeams', () => UserTeamsGraphQLConnection, { nullable: true })
  protected async getOwnedTeamsForRequestAndUser(
    @Args() request: TeamFiltersRequest,
    @Parent() user: UserGraphQLNode,
  ) {
    this.logger.log({
      user,
      request,
      message: 'Fetching owned teams for user',
    })

    const [filters, queryOptions, connection] = this.relay.unmarshalRequest<
      TeamFiltersRequest,
      Team
    >(request)

    const queryResult = await this.core.team.getFromOwner(user, filters, queryOptions)

    return this.relay.marshalResponse<TeamInterface>(queryResult, connection, user)
  }

  @Cacheable('0.id', 15 * 60)
  @Stopwatch()
  @ResolveField('isTeamLeader', () => Boolean, { nullable: true })
  protected async getIsTeamLeaderForRequestAndUser(
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    this.logger.log({
      userWithContext,
      message: 'Fetching if is team leader for user',
    })
    const isTeamLeader = await this.accessControl.isUserTeamLeader(userWithContext)

    return isTeamLeader
  }

  @Stopwatch()
  @ResolveField('objectives', () => UserObjectivesGraphQLConnection, { nullable: true })
  protected async getObjectivesForRequestAndUser(
    @Args() request: ObjectiveFiltersRequest,
    @Parent() user: UserGraphQLNode,
  ) {
    this.logger.log({
      user,
      request,
      message: 'Fetching objectives for user',
    })

    const [filters, queryOptions, connection] = this.relay.unmarshalRequest<
      ObjectiveFiltersRequest,
      Objective
    >(request)

    const queryResult = await this.core.objective.getFromOwner(user, filters, queryOptions)

    return this.relay.marshalResponse<ObjectiveInterface>(queryResult, connection, user)
  }

  @Stopwatch()
  @ResolveField('keyResults', () => UserKeyResultsGraphQLConnection, { nullable: true })
  protected async getKeyResultsForRequestAndUser(
    @Args() request: UserKeyResultsRequest,
    @Parent() user: UserGraphQLNode,
  ) {
    this.logger.log({
      user,
      request,
      message: 'Fetching key results for user',
    })

    const [options, _, connection] = this.relay.unmarshalRequest<UserKeyResultsRequest, KeyResult>(
      request,
    )

    const {
      active,
      hasUserCheckMarks,
      confidence,
      onlyKeyResultsFromCompany,
      onlyOwnerKeyResults,
      ...filters
    } = options
    const command = hasUserCheckMarks
      ? 'get-key-results-containing-user-checklist'
      : 'get-user-key-results'

    const queryResult = await this.corePorts.dispatchCommand<KeyResult[]>(
      command,
      user.id,
      filters,
      { active, confidence, onlyOwnerKeyResults },
    )
    // eslint-disable-next-line no-warning-comments
    // TODO: Esse filtro deve ser removido quando o backend for refatorado. O filtro pode ser feito dentro dos comandos, mas como a feature precisava ser entregue, foi feito dessa forma.
    const filteredResults = onlyKeyResultsFromCompany
      ? queryResult.filter((keyResult) => keyResult.teamId !== null)
      : queryResult
    return this.relay.marshalResponse<KeyResultInterface>(filteredResults, connection, user)
  }

  @Stopwatch()
  @ResolveField('keyResultsStatus', () => UserKeyResultsGraphQLConnection, { nullable: true })
  protected async getKeyResultsStatusForRequestAndUser(
    @Args() request: UserKeyResultsRequest,
    @Parent() user: UserGraphQLNode,
  ) {
    this.logger.log({
      user,
      request,
      message: 'Fetching key results statuses for user',
    })

    const [options, _, connection] = this.relay.unmarshalRequest<UserKeyResultsRequest, KeyResult>(
      request,
    )

    const {
      active,
      hasUserCheckMarks,
      confidence,
      onlyKeyResultsFromCompany,
      onlyOwnerKeyResults,
      ...filters
    } = options
    const command = hasUserCheckMarks
      ? 'get-user-key-results-statuses-with-checkmarks'
      : 'get-user-key-results-statuses'

    const queryResult = await this.corePorts.dispatchCommand<KeyResultInterface[]>(
      command,
      user.id,
      filters,
      { active, confidence, onlyOwnerKeyResults },
    )
    // eslint-disable-next-line no-warning-comments
    // TODO: Esse filtro deve ser removido quando o backend for refatorado. O filtro pode ser feito dentro dos comandos, mas como a feature precisava ser entregue, foi feito dessa forma.
    const filteredResults = onlyKeyResultsFromCompany
      ? queryResult.filter((keyResult) => keyResult.teamId !== null)
      : queryResult
    return this.relay.marshalResponse<KeyResultInterface>(filteredResults, connection, user)
  }

  @Cacheable('0.id', 5 * 60)
  @ResolveField('userIndicators', () => UserIndicatorsObject, {
    nullable: true,
  })
  protected async getUserIndicatorsForRequestAndUser(@Parent() user: UserGraphQLNode) {
    this.logger.log({
      user,
      message: 'Fetching user key results progress',
    })

    const queryResult = await this.corePorts.dispatchCommand('get-user-indicators', user.id)

    return queryResult
  }

  @Stopwatch()
  @ResolveField('keyResultComments', () => UserKeyResultCommentsGraphQLConnection, {
    nullable: true,
  })
  protected async getKeyResultCommentsForRequestAndUser(
    @Args() request: KeyResultCommentFiltersRequest,
    @Parent() user: UserGraphQLNode,
  ) {
    this.logger.log({
      user,
      request,
      message: 'Fetching comments by user',
    })

    const [filters, queryOptions, connection] = this.relay.unmarshalRequest<
      KeyResultCommentFiltersRequest,
      KeyResultComment
    >(request)

    const queryResult = await this.core.keyResult.getCommentsCreatedByUser(
      user,
      filters,
      queryOptions,
    )

    return this.relay.marshalResponse<KeyResultCommentInterface>(queryResult, connection, user)
  }

  @Stopwatch()
  @ResolveField('keyResultCheckIns', () => UserKeyResultCheckInsGraphQLConnection, {
    nullable: true,
  })
  protected async getKeyResultCheckInsForRequestAndUser(
    @Args() request: KeyResultCheckInFiltersRequest,
    @Parent() user: UserGraphQLNode,
  ) {
    this.logger.log({
      user,
      request,
      message: 'Fetching check-ins by user',
    })

    const [filters, queryOptions, connection] = this.relay.unmarshalRequest<
      KeyResultCheckInFiltersRequest,
      KeyResultCheckIn
    >(request)

    const queryResult = await this.core.keyResult.getCheckInsCreatedByUser(
      user,
      filters,
      queryOptions,
    )

    return this.relay.marshalResponse<KeyResultCheckInInterface>(queryResult, connection, user)
  }

  @Stopwatch()
  @ResolveField('tasks', () => UserTasksGraphQLConnection, { nullable: true })
  protected async getTasksForRequestAndUser(
    @Args() request: UserTasksRequest,
    @Parent() user: UserGraphQLNode,
  ) {
    this.logger.log({
      user,
      request,
      message: 'Fetching tasks for user',
    })

    const [options, getOptions, connection] = this.relay.unmarshalRequest<UserTasksRequest, Task>(
      request,
    )

    const queryResult = await this.corePorts.dispatchCommand<Task[]>(
      'get-tasks-from-user',
      user.id,
      options,
      getOptions,
    )

    return this.relay.marshalResponse<TaskInterface>(queryResult, connection, user)
  }

  @Cacheable((userWithContext, user) => [userWithContext.id, user.id], 5 * 60)
  @Stopwatch()
  @ResolveField('quarterlyProgress', () => UserReportProgressObject, { nullable: true })
  protected async getKeyResultsQuarterlyProgress(
    @RequestUserWithContext() userWithContext: UserWithContext,
    @Parent() user: UserGraphQLNode,
  ) {
    const isInTheSameCompany = await this.accessControl.isInTheSameCompany(userWithContext, user.id)
    if (!isInTheSameCompany) throw new ForbiddenException()
    const progress = await this.corePorts.dispatchCommand<UserReportProgress>(
      'get-user-quarterly-progress',
      user.id,
    )

    return progress
  }

  @Cacheable((userWithContext, user) => [userWithContext.id, user.id], 15 * 60)
  @Stopwatch()
  @ResolveField('yearlyProgress', () => UserReportProgressObject, { nullable: true })
  protected async getKeyResultsYearlyProgress(
    @RequestUserWithContext() userWithContext: UserWithContext,
    @Parent() user: UserGraphQLNode,
  ) {
    const isInTheSameCompany = await this.accessControl.isInTheSameCompany(userWithContext, user.id)
    if (!isInTheSameCompany) throw new ForbiddenException()
    const progress = await this.corePorts.dispatchCommand<UserReportProgress>(
      'get-user-yearly-progress',
      user.id,
    )

    return progress
  }

  @Cacheable((userWithContext, user) => [userWithContext.id, user.id], 5 * 60)
  @Stopwatch()
  @ResolveField('amplitude', () => UserProfileAmplitudeDataObject, { nullable: true })
  protected async getUserAmplitudeData(
    @RequestUserWithContext() userWithContext: UserWithContext,
    @Parent() user: UserGraphQLNode,
  ) {
    this.logger.log({
      user,
      message: 'Fetching user amplitude data',
    })

    const isInTheSameCompany = await this.accessControl.isInTheSameCompany(userWithContext, user.id)
    if (!isInTheSameCompany) throw new ForbiddenException()

    const amplitudeData = await this.corePorts.dispatchCommand<
      UserAmplitudeDataProperties['userData']['amp_props']
    >('get-user-profile-amplitude', user.id)

    return amplitudeData
  }

  // @Cacheable((request, user) => [user.id, request], 5 * 60)
  @Stopwatch()
  @ResolveField('settings', () => UserSettingsGraphQLConnection, {
    nullable: true,
  })
  protected async getSettingsForRequestAndUser(
    @Args() request: UserSettingFiltersRequest,
    @Parent() user: UserGraphQLNode,
  ) {
    this.logger.log({
      user,
      request,
      message: 'Fetching settings for user',
    })

    const [filters, _, connection] = this.relay.unmarshalRequest<
      UserSettingFiltersRequest,
      UserSetting
    >(request)

    const settings = await this.corePorts.dispatchCommand<UserSetting[]>(
      'get-user-settings',
      user.id,
      filters.keys,
    )

    return this.relay.marshalResponse<UserSettingInterface>(settings, connection, user)
  }

  private async parseUserPictureFileToRemoteURL(
    picturePromise?: Promise<FileUpload>,
  ): Promise<string | undefined> {
    if (typeof picturePromise === 'undefined') return

    const pictureFile = await picturePromise
    const pictureStoragePolicy = {
      write: VisibilityStorageEnum.PRIVATE,
      read: VisibilityStorageEnum.PUBLIC,
    }
    const pictureSpecification = {
      policy: pictureStoragePolicy,
      path: 'user/pictures',
    }

    return this.uploadProvider.uploadFileToRepository(pictureFile, pictureSpecification)
  }
}
