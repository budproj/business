import { Injectable } from '@nestjs/common'
import { flatten, uniqBy } from 'lodash'
import { FindConditions, In } from 'typeorm'

import { CredentialsAdapter } from '@adapters/credentials/credentials.adapter'
import { Credential, NewCredentialData } from '@adapters/credentials/credentials.interface'
import { CoreEntityProvider } from '@core/entity.provider'
import { CoreQueryContext } from '@core/interfaces/core-query-context.interface'
import { GetOptions } from '@core/interfaces/get-options'
import { Cycle } from '@core/modules/cycle/cycle.orm-entity'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { UserSettingProvider } from '@core/modules/user/setting/user-setting.provider'
import { CreationQuery } from '@core/types/creation-query.type'
import { AuthzCredentialsProvider } from '@infrastructure/authz/providers/credentials.provider'

import { UserStatus } from './enums/user-status.enum'
import { UserCredentialsAdditionalData, UserInterface } from './user.interface'
import { User } from './user.orm-entity'
import { UserRepository } from './user.repository'

@Injectable()
export class UserProvider extends CoreEntityProvider<User, UserInterface> {
  private readonly credentials: CredentialsAdapter

  constructor(
    public readonly setting: UserSettingProvider,
    protected readonly repository: UserRepository,
    authz: AuthzCredentialsProvider,
  ) {
    super(UserProvider.name, repository)

    this.credentials = authz
  }

  public async getUserTeams(
    user: Partial<UserInterface>,
    filters?: FindConditions<TeamInterface>,
    options?: GetOptions<TeamInterface>,
  ): Promise<TeamInterface[]> {
    const queryOptions = this.repository.marshalGetOptions(options)
    const whereSelector = {
      id: user.id,
      ...filters,
    }

    const queryResult = await this.repository.find({
      relations: ['teams'],
      where: whereSelector,
      ...queryOptions,
    })
    return uniqBy(flatten(queryResult.map((user) => user.teams)), 'id')
  }

  public buildUserFullName(user: UserInterface) {
    return `${user.firstName} ${user.lastName}`
  }

  public async getUserFromSubjectWithTeamRelation(authzSub: UserInterface['authzSub']) {
    return this.repository.findOne({ authzSub }, { relations: ['teams'] })
  }

  public async getFromID(id: string): Promise<User> {
    return this.repository.findOne({ id })
  }

  public async getFromIndexes(indexes: Partial<UserInterface>): Promise<User> {
    return this.repository.findOne(indexes)
  }

  public async getByIds(ids: string[]): Promise<User[]> {
    return this.repository.find({ where: { id: In(ids) } })
  }

  public async getUsersWithActiveObjectives(teamsIds: Array<TeamInterface['id']>): Promise<User[]> {
    const users = await this.repository
      .createQueryBuilder()
      .innerJoin(`${User.name}.objectives`, 'objective')
      .innerJoinAndSelect(`${User.name}.teams`, 'team')
      .innerJoin(Cycle, 'cycle', 'cycle.id = objective.cycle_id')
      .where('objective.teamId IS NULL')
      .andWhere('team.id IN(:...teamsIds)', { teamsIds })
      .andWhere('cycle.active IS TRUE')
      .getMany()

    return users
  }

  public async deactivate(userID: string): Promise<void> {
    const user = await this.getFromID(userID)

    await this.credentials.blockUser(user.authzSub)
    await this.repository.update(user.id, { status: UserStatus.INACTIVE })
  }

  public async updateEmailInCredentials(userID: string, email: string): Promise<void> {
    const user = await this.getFromID(userID)

    await this.credentials.updateEmail(user.authzSub, email)
  }

  public async generateCredentials(
    email: string,
    additionalData?: UserCredentialsAdditionalData,
  ): Promise<Credential> {
    const credentialData: NewCredentialData = {
      name: '',
      email,
      password: this.credentials.generatePassword(),
      ...additionalData,
    }

    return this.credentials.create(credentialData)
  }

  public async createUser(data: UserInterface, autoInvite = true): Promise<User> {
    const createdData = await this.create(data)
    const user = createdData[0]

    if (autoInvite) await this.invite(user.email)

    return user
  }

  public buildUserInitials(data: UserInterface): string {
    const firstLetter = data.firstName[0]
    const lastLetter = data?.lastName.split(' ').slice(-1).join()[0]

    return firstLetter + lastLetter
  }

  public async updateUserProperty(userID: string, key: string, value: string): Promise<void> {
    const user = await this.getOne({ id: userID })

    return this.credentials.updateUserProperty(user.authzSub, key, value)
  }

  public async invite(email: string): Promise<void> {
    await this.credentials.invite(email)
  }

  protected async protectCreationQuery(
    _query: CreationQuery<User>,
    _data: Partial<UserInterface>,
    _queryContext: CoreQueryContext,
  ) {
    return []
  }
}
