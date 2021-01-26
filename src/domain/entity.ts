import { Logger } from '@nestjs/common'
import { flow } from 'lodash'
import {
  Brackets,
  DeleteResult,
  FindConditions,
  Repository,
  SelectQueryBuilder,
  WhereExpression,
} from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

import { CONSTRAINT } from './constants'
import { TeamDTO } from './team/dto'
import { UserDTO } from './user/dto'

export interface DomainEntityServiceInterface<E, D> {
  logger: Logger
  repository: DomainEntityRepository<E>

  buildContext: (user: UserDTO, constraint: CONSTRAINT) => DomainServiceContext
  createWithConstraint: (data: Partial<D>, queryContext: DomainQueryContext) => Promise<E[]>
  getOneWithConstraint: (
    selector: FindConditions<E>,
    queryContext: DomainQueryContext,
  ) => Promise<E>
  getManyWithConstraint: (
    selector: FindConditions<E>,
    queryContext: DomainQueryContext,
  ) => Promise<E[]>
  getOne: (
    selector: FindConditions<E>,
    queryContext?: DomainQueryContext,
    options?: DomainServiceGetOptions,
  ) => Promise<E>
  getMany: (
    selector: FindConditions<E>,
    queryContext?: DomainQueryContext,
    options?: DomainServiceGetOptions,
  ) => Promise<E[]>
  updateWithConstraint: (
    selector: FindConditions<E>,
    newData: QueryDeepPartialEntity<E>,
    queryContext: DomainQueryContext,
  ) => Promise<E>
  deleteWithConstraint: (
    selector: FindConditions<E>,
    queryContext: DomainQueryContext,
  ) => Promise<DeleteResult>
}

export interface DomainServiceGetOptions {
  limit?: number
}

export interface DomainServiceContext {
  constraint: CONSTRAINT
  user: UserDTO
}

export interface QueryContext {
  companies: Array<TeamDTO['id']>
  teams: Array<TeamDTO['id']>
  userTeams: Array<TeamDTO['id']>
}

export interface DomainQueryContext extends DomainServiceContext {
  query: QueryContext
}

export abstract class DomainEntityService<E, D> implements DomainEntityServiceInterface<E, D> {
  public readonly logger: Logger

  constructor(
    public readonly repository: DomainEntityRepository<E>,
    public readonly loggerName: string,
  ) {
    this.logger = new Logger(loggerName ?? DomainEntityService.name)
  }

  public buildContext(user: UserDTO, constraint: CONSTRAINT) {
    const context: DomainServiceContext = {
      user,
      constraint,
    }

    return context
  }

  public async createWithConstraint(data: Partial<D>, queryContext: DomainQueryContext) {
    const availableSelectors = {
      [CONSTRAINT.ANY]: async () => this.create(data, queryContext),
      [CONSTRAINT.COMPANY]: async () => this.createIfUserIsInCompany(data, queryContext),
      [CONSTRAINT.TEAM]: async () => this.createIfUserIsInTeam(data, queryContext),
      [CONSTRAINT.OWNS]: async () => this.createIfUserOwnsIt(data, queryContext),
    }
    const constrainedSelector = availableSelectors[queryContext.constraint]

    return constrainedSelector()
  }

  public async getOneWithConstraint(selector: FindConditions<E>, queryContext: DomainQueryContext) {
    const query = await this.getWithConstraint(selector, queryContext)
    const data = this.getOneInQuery(query, queryContext)

    return data
  }

  public async getManyWithConstraint(
    selector: FindConditions<E>,
    queryContext: DomainQueryContext,
  ) {
    const query = await this.getWithConstraint(selector, queryContext)
    const data = this.getManyInQuery(query, queryContext)

    return data
  }

  public async updateWithConstraint(
    selector: FindConditions<E>,
    newData: QueryDeepPartialEntity<E>,
    queryContext: DomainQueryContext,
  ) {
    const availableSelectors = {
      [CONSTRAINT.ANY]: async () => this.update(selector, newData, queryContext),
      [CONSTRAINT.COMPANY]: async () =>
        this.updateIfUserIsInCompany(selector, newData, queryContext),
      [CONSTRAINT.TEAM]: async () => this.updateIfUserIsInTeam(selector, newData, queryContext),
      [CONSTRAINT.OWNS]: async () => this.updateIfUserOwnsIt(selector, newData, queryContext),
    }
    const constrainedSelector = availableSelectors[queryContext.constraint]

    return constrainedSelector()
  }

  public async deleteWithConstraint(selector: FindConditions<E>, queryContext: DomainQueryContext) {
    const availableSelectors = {
      [CONSTRAINT.ANY]: async () => this.delete(selector, queryContext),
      [CONSTRAINT.COMPANY]: async () => this.deleteIfUserIsInCompany(selector, queryContext),
      [CONSTRAINT.TEAM]: async () => this.deleteIfUserIsInTeam(selector, queryContext),
      [CONSTRAINT.OWNS]: async () => this.deleteIfUserOwnsIt(selector, queryContext),
    }
    const constrainedSelector = availableSelectors[queryContext.constraint]

    return constrainedSelector()
  }

  public async getOne(
    selector: FindConditions<E>,
    queryContext?: DomainQueryContext,
    options?: DomainServiceGetOptions,
  ) {
    const query = this.get(selector, queryContext, undefined, options)

    return query.getOne()
  }

  public async getMany(
    selector: FindConditions<E>,
    queryContext?: DomainQueryContext,
    options?: DomainServiceGetOptions,
  ) {
    const query = this.get(selector, queryContext, undefined, options)

    return query.getMany()
  }

  protected async create(data: Partial<D> | Array<Partial<D>>, _context: DomainQueryContext) {
    const result = await this.repository.insert(data as QueryDeepPartialEntity<E>)

    return result.raw
  }

  protected async getWithConstraint(selector: FindConditions<E>, queryContext: DomainQueryContext) {
    const availableSelectors = {
      [CONSTRAINT.ANY]: async () => this.get(selector, queryContext),
      [CONSTRAINT.COMPANY]: async () => this.getIfUserIsInCompany(selector, queryContext),
      [CONSTRAINT.TEAM]: async () => this.getIfUserIsInTeam(selector, queryContext),
      [CONSTRAINT.OWNS]: async () => this.getIfUserOwnsIt(selector, queryContext),
    }
    const constrainedSelector = availableSelectors[queryContext.constraint]

    return constrainedSelector()
  }

  protected get(
    selector: FindConditions<E>,
    _queryContext: DomainQueryContext,
    constrainQuery?: SelectionQueryConstrain<E>,
    options?: DomainServiceGetOptions,
  ) {
    const query = this.repository
      .createQueryBuilder()
      .where(selector)
      .take(options?.limit ?? 0)

    return constrainQuery ? constrainQuery(query) : query
  }

  protected async getIfUserIsInCompany(
    selector: FindConditions<E>,
    queryContext: DomainQueryContext,
  ) {
    const { query, user } = queryContext
    const constrainQuery = this.repository.constraintQueryToTeam(query.teams, user)

    return this.get(selector, queryContext, constrainQuery)
  }

  protected async getIfUserIsInTeam(selector: FindConditions<E>, queryContext: DomainQueryContext) {
    const { query, user } = queryContext
    const constrainQuery = this.repository.constraintQueryToTeam(query.userTeams, user)

    return this.get(selector, queryContext, constrainQuery)
  }

  protected async getIfUserOwnsIt(selector: FindConditions<E>, queryContext: DomainQueryContext) {
    const { user } = queryContext
    const constrainQuery = this.repository.constraintQueryToOwns(user)

    return this.get(selector, queryContext, constrainQuery)
  }

  protected async getOneInQuery(query: SelectQueryBuilder<E>, queryContext?: DomainQueryContext) {
    this.logger.debug({
      queryContext,
      message: `Getting one for request`,
    })

    return query.getOne()
  }

  protected async getManyInQuery(query: SelectQueryBuilder<E>, queryContext?: DomainQueryContext) {
    this.logger.debug({
      queryContext,
      message: `Getting many for request`,
    })

    return query.getMany()
  }

  protected async update(
    selector: FindConditions<E>,
    newData: QueryDeepPartialEntity<E>,
    queryContext: DomainQueryContext,
  ) {
    await this.repository.update(selector, newData)

    return this.getOne(selector, queryContext)
  }

  protected async updateIfUserIsInCompany(
    selector: FindConditions<E>,
    newData: QueryDeepPartialEntity<E>,
    queryContext: DomainQueryContext,
  ) {
    const { query, user } = queryContext

    const constrainQuery = this.repository.constraintQueryToTeam(query.teams, user)
    const selectionQuery = this.repository.createQueryBuilder().where(selector)
    const constrainedSelectionQuery = constrainQuery(selectionQuery)

    const allowedData = await constrainedSelectionQuery.getMany()
    if (allowedData.length === 0) return

    return this.update(selector, newData, queryContext)
  }

  protected async updateIfUserIsInTeam(
    selector: FindConditions<E>,
    newData: QueryDeepPartialEntity<E>,
    queryContext: DomainQueryContext,
  ) {
    const { query, user } = queryContext

    const constrainQuery = this.repository.constraintQueryToTeam(query.userTeams, user)
    const selectionQuery = this.repository.createQueryBuilder().where(selector)
    const constrainedSelectionQuery = constrainQuery(selectionQuery)

    const allowedData = await constrainedSelectionQuery.getMany()
    if (allowedData.length === 0) return

    return this.update(selector, newData, queryContext)
  }

  protected async updateIfUserOwnsIt(
    selector: FindConditions<E>,
    newData: QueryDeepPartialEntity<E>,
    queryContext: DomainQueryContext,
  ) {
    const { user } = queryContext

    const constrainQuery = this.repository.constraintQueryToOwns(user)
    const selectionQuery = this.repository.createQueryBuilder().where(selector)
    const constrainedSelectionQuery = constrainQuery(selectionQuery)

    const allowedData = await constrainedSelectionQuery.getMany()
    if (allowedData.length === 0) return

    return this.update(selector, newData, queryContext)
  }

  protected async delete(selector: FindConditions<E>, _queryContext: DomainQueryContext) {
    return this.repository.delete(selector)
  }

  protected async deleteIfUserIsInCompany(
    selector: FindConditions<E>,
    queryContext: DomainQueryContext,
  ) {
    const { query, user } = queryContext

    const constrainQuery = this.repository.constraintQueryToTeam(query.companies, user)
    const selectionQuery = this.repository.createQueryBuilder().where(selector)
    const constrainedSelectionQuery = constrainQuery(selectionQuery)

    const allowedData = await constrainedSelectionQuery.getMany()
    if (allowedData.length === 0) return

    return this.delete(selector, queryContext)
  }

  protected async deleteIfUserIsInTeam(
    selector: FindConditions<E>,
    queryContext: DomainQueryContext,
  ) {
    const { query, user } = queryContext

    const constrainQuery = this.repository.constraintQueryToTeam(query.teams, user)
    const selectionQuery = this.repository.createQueryBuilder().where(selector)
    const constrainedSelectionQuery = constrainQuery(selectionQuery)

    const allowedData = await constrainedSelectionQuery.getMany()
    if (allowedData.length === 0) return

    return this.delete(selector, queryContext)
  }

  protected async deleteIfUserOwnsIt(
    selector: FindConditions<E>,
    queryContext: DomainQueryContext,
  ) {
    const { user } = queryContext

    const constrainQuery = this.repository.constraintQueryToOwns(user)
    const selectionQuery = this.repository.createQueryBuilder().where(selector)
    const constrainedSelectionQuery = constrainQuery(selectionQuery)

    const allowedData = await constrainedSelectionQuery.getMany()
    if (allowedData.length === 0) return

    return this.delete(selector, queryContext)
  }

  protected abstract createIfUserIsInCompany(
    data: Partial<D>,
    queryContext: DomainQueryContext,
  ): Promise<E[]>

  protected abstract createIfUserIsInTeam(
    data: Partial<D>,
    queryContext: DomainQueryContext,
  ): Promise<E[]>

  protected abstract createIfUserOwnsIt(
    data: Partial<D>,
    queryContext: DomainQueryContext,
  ): Promise<E[]>
}

export type SelectionQueryConstrain<E> = (query?: SelectQueryBuilder<E>) => SelectQueryBuilder<E>

export interface DomainEntityRepositoryInterface<E> {
  constraintQueryToTeam: (
    allowedTeams: Array<TeamDTO['id']>,
    user: UserDTO,
  ) => SelectionQueryConstrain<E>

  constraintQueryToOwns: (user: UserDTO) => (query: SelectQueryBuilder<E>) => SelectQueryBuilder<E>
}

export enum CONSTRAINT_TYPE {
  AND = 'and',
  OR = 'or',
}

export enum CONDITIONAL_METHOD_NAMES {
  AND_WHERE = 'andWhere',
  OR_WHERE = 'orWhere',
}

export abstract class DomainEntityRepository<E>
  extends Repository<E>
  implements DomainEntityRepositoryInterface<E> {
  protected composeTeamQuery = flow(this.setupOwnsQuery, this.setupTeamQuery)

  public constraintQueryToTeam(allowedTeams: Array<TeamDTO['id']>, user: UserDTO) {
    const addConstraintToQuery = (query?: SelectQueryBuilder<E>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const composedQuery = this.composeTeamQuery(baseQuery)

      return composedQuery.andWhere(
        new Brackets((query) => {
          const teamOwnedEntities = this.addTeamWhereExpression(query, allowedTeams)
          const userAndTeamOwnedEntities = this.addOwnsWhereExpression(teamOwnedEntities, user)

          return userAndTeamOwnedEntities
        }),
      )
    }

    return addConstraintToQuery
  }

  public constraintQueryToOwns(user: UserDTO) {
    const addConstraintToQuery = (query?: SelectQueryBuilder<E>) => {
      const baseQuery = query ?? this.createQueryBuilder()

      return baseQuery.andWhere(
        new Brackets((query) => {
          const userOwnedEntities = this.addOwnsWhereExpression(query, user)

          return userOwnedEntities
        }),
      )
    }

    return addConstraintToQuery
  }

  protected setupTeamQuery(query: SelectQueryBuilder<E>) {
    return query
  }

  protected setupOwnsQuery(query: SelectQueryBuilder<E>) {
    return query
  }

  protected selectConditionMethodNameBasedOnConstraintType(constraintType: CONSTRAINT_TYPE) {
    const methodNames = {
      [CONSTRAINT_TYPE.AND]: CONDITIONAL_METHOD_NAMES.AND_WHERE,
      [CONSTRAINT_TYPE.OR]: CONDITIONAL_METHOD_NAMES.OR_WHERE,
    }
    const constraintTypeMethodName = methodNames[constraintType]

    return constraintTypeMethodName
  }

  protected abstract addTeamWhereExpression(
    query: WhereExpression,
    allowedTeams: Array<TeamDTO['id']>,
    constraintType?: CONSTRAINT_TYPE,
  ): WhereExpression

  protected abstract addOwnsWhereExpression(
    query: WhereExpression,
    user: UserDTO,
    constraintType?: CONSTRAINT_TYPE,
  ): WhereExpression
}

export interface DomainEntitySpecificationInterface<T> {
  currentRevision?: (candidate: T) => boolean

  isSatisfiedBy(candidate: T): boolean
  and(other: DomainEntitySpecificationInterface<T>): DomainEntitySpecificationInterface<T>
  not(): DomainEntitySpecificationInterface<T>
}

export abstract class DomainEntitySpecification<T>
  implements DomainEntitySpecificationInterface<T> {
  public and(other: DomainEntitySpecificationInterface<T>) {
    return new AndSpecification(this, other)
  }

  public not() {
    return new NotSpecification(this)
  }

  public abstract isSatisfiedBy(candidate: T): boolean
}

class AndSpecification<T> extends DomainEntitySpecification<T> {
  private readonly one: DomainEntitySpecificationInterface<T>
  private readonly other: DomainEntitySpecificationInterface<T>

  public constructor(
    one: DomainEntitySpecificationInterface<T>,
    other: DomainEntitySpecificationInterface<T>,
  ) {
    super()
    this.one = one
    this.other = other
  }

  public isSatisfiedBy(candidate: T) {
    return this.one.isSatisfiedBy(candidate) && this.other.isSatisfiedBy(candidate)
  }
}

class NotSpecification<T> extends DomainEntitySpecification<T> {
  private readonly wrapped: DomainEntitySpecificationInterface<T>

  public constructor(wrapped: DomainEntitySpecificationInterface<T>) {
    super()
    this.wrapped = wrapped
  }

  public isSatisfiedBy(candidate: T) {
    return !this.wrapped.isSatisfiedBy(candidate)
  }
}
