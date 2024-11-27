import { Injectable } from '@nestjs/common'
import { flatten, uniqBy } from 'lodash'
import { FindConditions, In } from 'typeorm'

import { CredentialsAdapter } from '@adapters/credentials/credentials.adapter'
import { Credential, NewCredentialData } from '@adapters/credentials/credentials.interface'
import { CoreEntityProvider } from '@core/entity.provider'
import { Sorting } from '@core/enums/sorting'
import { CoreQueryContext } from '@core/interfaces/core-query-context.interface'
import { GetOptions } from '@core/interfaces/get-options'
import { Cycle } from '@core/modules/cycle/cycle.orm-entity'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { UserSettingProvider } from '@core/modules/user/setting/user-setting.provider'
import { CreationQuery } from '@core/types/creation-query.type'
import { UserProfileAdapter } from '@infrastructure/amplitude/adapters/user-profil.adapter'
import { UserProfileProvider } from '@infrastructure/amplitude/providers/user-profile.provider'
import { AuthzCredentialsProvider } from '@infrastructure/authz/providers/credentials.provider'
import { Stopwatch } from '@lib/logger/pino.decorator'

import { TeamRepository } from '../team/team.repository'

import { UserStatus } from './enums/user-status.enum'
import { UserCredentialsAdditionalData, UserInterface } from './user.interface'
import { User } from './user.orm-entity'
import { UserRepository } from './user.repository'

@Injectable()
export class UserProvider extends CoreEntityProvider<User, UserInterface> {
  public credentials: CredentialsAdapter
  public amplitude: UserProfileAdapter

  constructor(
    public readonly setting: UserSettingProvider,
    protected readonly repository: UserRepository,
    protected readonly team_repository: TeamRepository,
    authz: AuthzCredentialsProvider,
    amplitude: UserProfileProvider,
  ) {
    super(UserProvider.name, repository)

    this.credentials = authz
    this.amplitude = amplitude
  }

  @Stopwatch()
  public async getUserTeams(
    user: Partial<UserInterface>,
    filters?: Partial<TeamInterface>,
    options?: GetOptions<TeamInterface>,
  ): Promise<TeamInterface[]> {
    return this.team_repository
      .createQueryBuilder('team')
      .innerJoin('team.users', 'user', 'user.id = :userId', { userId: user.id })
      .andWhere(filters)
      .take(options?.limit ?? 0)
      .offset(options?.offset ?? 0)
      .getMany()
  }

  public async getUsersByTeams(
    teamIds: string[],
    filters?: Partial<UserInterface>,
    options?: GetOptions<User>,
  ): Promise<User[]> {
    const orderBy = this.repository.marshalOrderBy(
      options?.orderBy ?? {
        firstName: Sorting.ASC,
        lastName: Sorting.ASC,
      },
    )

    const alias = this.repository.entityName

    // Const query = this.repository
    //   .createQueryBuilder(alias)
    //   .innerJoin(`${alias}.teams`, 'userTeam', 'userTeam.id IN (:...teamIds)', { teamIds })
    //   .distinctOn([`${alias}.id`])
    //   .where(filters)
    //   .take(options?.limit ?? 0)
    //   .offset(options?.offset ?? 0)
    //   .orderBy(orderBy)
    //
    // return query.getMany()

    return this.repository
      .createQueryBuilder(alias)
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('tu.user_id')
          .from('team_users_user', 'tu')
          .where('tu.team_id IN (:...teamIds)', { teamIds })
          .distinctOn(['tu.user_id'])
          .orderBy({ 'tu.user_id': Sorting.ASC })
          .getQuery()

        return `${alias}.id IN ${subQuery}`
      })
      .andWhere(filters)
      .take(options?.limit ?? 0)
      .offset(options?.offset ?? 0)
      .orderBy(orderBy)
      .getMany()
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

  @Stopwatch()
  public async getUsersWithActiveObjectives(teamsIds: Array<TeamInterface['id']>): Promise<User[]> {
    const users = await this.repository
      .createQueryBuilder()
      .innerJoin(`${User.name}.objectives`, 'objective')
      .innerJoinAndSelect(`${User.name}.teams`, 'team')
      .innerJoin(Cycle, 'cycle', 'cycle.id = objective.cycle_id')
      .where('objective.teamId IS NULL')
      .andWhere('team.id IN(:...teamsIds)', { teamsIds })
      .andWhere('cycle.active IS TRUE')
      .orderBy(`${User.name}.firstName`, 'ASC')
      .getMany()

    return users
  }

  public async deactivate(userID: string): Promise<void> {
    const user = await this.getFromID(userID)

    await this.credentials.blockUser(user.authzSub)
    await this.repository.update(user.id, { status: UserStatus.INACTIVE })
  }

  public async reactivate(userID: string): Promise<void> {
    const user = await this.getFromID(userID)

    await this.credentials.unblockUser(user.authzSub)
    await this.repository.update(user.id, { status: UserStatus.ACTIVE })
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
