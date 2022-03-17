import { InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common'
import { Args, Parent, ResolveField } from '@nestjs/graphql'
import { UserInputError } from 'apollo-server-fastify'
import { FileUpload } from 'graphql-upload'

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
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { Team } from '@core/modules/team/team.orm-entity'
import { EmailAlreadyExistsException } from '@core/modules/user/exceptions/email-already-exists.exception'
import { Key } from '@core/modules/user/setting/user-setting.enums'
import { UserSettingInterface } from '@core/modules/user/setting/user-setting.interface'
import { UserSetting } from '@core/modules/user/setting/user-settings.orm-entity'
import { UserInterface } from '@core/modules/user/user.interface'
import { User } from '@core/modules/user/user.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'
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

import { UserKeyResultCheckInsGraphQLConnection } from './connections/user-key-result-check-ins/user-key-result-check-ins.connection'
import { UserKeyResultCommentsGraphQLConnection } from './connections/user-key-result-comments/user-key-result-comments.connection'
import { UserKeyResultsGraphQLConnection } from './connections/user-key-results/user-key-results.connection'
import { UserObjectivesGraphQLConnection } from './connections/user-objectives/user-objectives.connection'
import { UserTeamsGraphQLConnection } from './connections/user-teams/user-teams.connection'
import { EmailAlreadyExistsApolloError } from './exceptions/email-already-exists.exception'
import { UserCreateRequest } from './requests/user-create.request'
import { UserDeactivateRequest } from './requests/user-deactivate.request'
import { UserKeyResultsRequest } from './requests/user-key-results.request'
import { UserUpdateRequest } from './requests/user-update.request'
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
    @Args() request: UserDeactivateRequest,
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

  @ResolveField('fullName', () => String)
  protected async getFullNameForUser(@Parent() user: UserGraphQLNode) {
    this.logger.log({
      user,
      message: 'Fetching user full name',
    })

    return this.core.user.buildUserFullName(user)
  }

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

    const queryResult = await this.core.team.getUserCompanies(user, filters, queryOptions)

    return this.relay.marshalResponse<Team>(queryResult, connection, user)
  }

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

    const { active, hasUserCheckMarks, ...filters } = options
    const command = hasUserCheckMarks
      ? 'get-key-results-containing-user-checklist'
      : 'get-user-key-results'

    const queryResult = await this.corePorts.dispatchCommand<KeyResult[]>(
      command,
      user.id,
      filters,
      { active },
    )

    return this.relay.marshalResponse<KeyResultInterface>(queryResult, connection, user)
  }

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
