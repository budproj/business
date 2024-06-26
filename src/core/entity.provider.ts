import { Logger } from '@nestjs/common'
import { startOfWeek } from 'date-fns'
import { flatten } from 'lodash'
import { DeleteResult, FindConditions, SelectQueryBuilder } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

import { Scope } from '@adapters/policy/enums/scope.enum'
import { SCOPE_PRIORITY } from '@adapters/policy/policy.constants'

import { CoreEntity } from './core.orm-entity'
import { CoreEntityRepository } from './core.repository'
import { MutationQueryType } from './enums/mutation-query-type.enum'
import { CoreContext } from './interfaces/core-context.interface'
import { CoreQueryContext } from './interfaces/core-query-context.interface'
import { GetOptions } from './interfaces/get-options'
import { UserInterface } from './modules/user/user.interface'
import { CreationQuery } from './types/creation-query.type'
import { EntityOrderAttributes, OrderAttribute } from './types/order-attribute.type'
import { SelectionQueryConstrain } from './types/selection-query-constrain.type'

export abstract class CoreEntityProvider<E extends CoreEntity, I> {
  protected readonly logger: Logger

  constructor(
    protected readonly loggerName: string,
    protected readonly repository: CoreEntityRepository<E>,
  ) {
    this.logger = new Logger(loggerName ?? CoreEntityProvider.name)
  }

  public buildContext(user: UserInterface, constraint: Scope): CoreContext {
    const context: CoreContext = {
      user,
      constraint,
    }

    return context
  }

  public async createWithConstraint(
    data: Partial<I>,
    queryContext: CoreQueryContext,
  ): Promise<E[]> {
    const shouldConstrainCreation = queryContext.constraint !== Scope.ANY

    return shouldConstrainCreation
      ? this.createIfWithinConstraint(data, queryContext)
      : this.create(data, queryContext)
  }

  public async getOneWithConstraint(
    selector: FindConditions<E>,
    queryContext: CoreQueryContext,
  ): Promise<E> {
    const query = await this.getWithConstraint(selector, queryContext)
    const data = this.getOneInQuery(query, queryContext)

    return data
  }

  public async getManyWithConstraint(
    selector: FindConditions<E>,
    queryContext: CoreQueryContext,
    options?: GetOptions<E>,
  ): Promise<E[]> {
    const query = await this.getWithConstraint(selector, queryContext, options)
    const data = this.getManyInQuery(query, queryContext)

    return data
  }

  public async updateWithConstraint(
    selector: FindConditions<E>,
    newData: QueryDeepPartialEntity<E>,
    queryContext: CoreQueryContext,
  ): Promise<E> {
    const shouldConstrainCreation = queryContext.constraint !== Scope.ANY

    return shouldConstrainCreation
      ? this.updateIfWithinConstraint(selector, newData, queryContext)
      : this.update(selector, newData, queryContext)
  }

  public async deleteWithConstraint(selector: FindConditions<E>, queryContext: CoreQueryContext) {
    const shouldConstrainDeletion = queryContext.constraint !== Scope.ANY

    return shouldConstrainDeletion
      ? this.deleteIfWithinConstraint(selector, queryContext)
      : this.delete(selector, queryContext)
  }

  public async getOne(
    selector: FindConditions<E>,
    queryContext?: CoreQueryContext,
    options?: GetOptions<E>,
  ): Promise<E> {
    const query = await this.get(selector, queryContext, undefined, options)

    return query.getOne()
  }

  public async getMany(
    selector: FindConditions<E>,
    queryContext?: CoreQueryContext,
    options?: GetOptions<E>,
  ): Promise<E[]> {
    const query = await this.get(selector, queryContext, undefined, options)

    return query.getMany()
  }

  public async defineResourceHighestScope(
    entity: E,
    originalQueryContext: CoreQueryContext,
    currentScope: Scope = Scope.ANY,
  ): Promise<Scope> {
    const currentScopeIndex = SCOPE_PRIORITY.indexOf(currentScope)
    const nextScopeIndex = currentScopeIndex + 1
    const isLastIndex = nextScopeIndex + 1 === SCOPE_PRIORITY.length

    const selector = { id: entity.id } as any
    const nextScope = SCOPE_PRIORITY[nextScopeIndex]
    const queryContext = this.changeConstraintInQueryContext(originalQueryContext, nextScope)

    const foundData = await this.getOneWithConstraint(selector, queryContext)
    if (!foundData) return currentScope

    return isLastIndex
      ? nextScope
      : this.defineResourceHighestScope(entity, queryContext, nextScope)
  }

  public async update(
    selector: FindConditions<E>,
    newData: QueryDeepPartialEntity<E>,
    queryContext?: CoreQueryContext,
  ): Promise<E> {
    await this.repository.update(selector, newData)

    return this.getOne(selector, queryContext)
  }

  public async delete(
    selector: FindConditions<E>,
    _queryContext?: CoreQueryContext,
  ): Promise<DeleteResult> {
    return this.repository.delete(selector)
  }

  public async get(
    selector: FindConditions<E>,
    _queryContext?: CoreQueryContext,
    constrainQuery?: SelectionQueryConstrain<E>,
    options?: GetOptions<E>,
  ): Promise<SelectQueryBuilder<E>> {
    const orderBy = this.repository.marshalOrderBy(options?.orderBy)

    const query = this.repository
      .createQueryBuilder()
      .where(selector)
      .take(options?.limit ?? 0)
      .offset(options?.offset ?? 0)
      .orderBy(orderBy)

    return constrainQuery ? constrainQuery(query) : query
  }

  protected async create(
    data: Partial<I> | Array<Partial<I>>,
    _queryContext?: CoreQueryContext,
  ): Promise<E[]> {
    const result = await this.repository.insert(data as QueryDeepPartialEntity<E>)
    const createdIDs = result.identifiers.map((data) => data.id)

    const createdData = await this.repository.findByIds(createdIDs)

    return createdData
  }

  protected async createIfWithinConstraint(
    data: Partial<I>,
    queryContext: CoreQueryContext,
  ): Promise<E[]> {
    const creationQuery = async () => this.create(data, queryContext)

    return this.protectCreationQuery(creationQuery, data, queryContext)
  }

  protected async getWithConstraint(
    selector: FindConditions<E>,
    queryContext: CoreQueryContext,
    options?: GetOptions<E>,
  ): Promise<SelectQueryBuilder<E>> {
    const availableSelectors = {
      [Scope.ANY]: async () => this.get(selector, queryContext, undefined, options),
      [Scope.COMPANY]: async () => this.getIfUserIsInCompany(selector, queryContext, options),
      [Scope.TEAM]: async () => this.getIfUserIsInTeam(selector, queryContext, options),
      [Scope.OWNS]: async () => this.getIfUserOwnsIt(selector, queryContext, options),
    }
    const constrainedSelector = availableSelectors[queryContext.constraint]
    if (!constrainedSelector) return

    return constrainedSelector()
  }

  protected async getIfUserIsInCompany(
    selector: FindConditions<E>,
    queryContext: CoreQueryContext,
    options?: GetOptions<E>,
  ): Promise<SelectQueryBuilder<E>> {
    const { query, user } = queryContext
    const constrainQuery = this.repository.constraintQueryToTeam(query.teams, user)

    return this.get(selector, queryContext, constrainQuery, options)
  }

  protected async getIfUserIsInTeam(
    selector: FindConditions<E>,
    queryContext: CoreQueryContext,
    options?: GetOptions<E>,
  ): Promise<SelectQueryBuilder<E>> {
    const { query, user } = queryContext
    const constrainQuery = this.repository.constraintQueryToTeam(query.userTeams, user)

    return this.get(selector, queryContext, constrainQuery, options)
  }

  protected async getIfUserOwnsIt(
    selector: FindConditions<E>,
    queryContext: CoreQueryContext,
    options?: GetOptions<E>,
  ): Promise<SelectQueryBuilder<E>> {
    const { user } = queryContext
    const constrainQuery = this.repository.constraintQueryToOwns(user)

    return this.get(selector, queryContext, constrainQuery, options)
  }

  protected async getOneInQuery(
    query: SelectQueryBuilder<E>,
    queryContext?: CoreQueryContext,
  ): Promise<E> {
    return query.getOne()
  }

  protected async getManyInQuery(
    query: SelectQueryBuilder<E>,
    queryContext?: CoreQueryContext,
  ): Promise<E[]> {
    return query.getMany()
  }

  protected async updateIfWithinConstraint(
    selector: FindConditions<E>,
    newData: QueryDeepPartialEntity<E>,
    queryContext: CoreQueryContext,
  ): Promise<E> {
    const updateQuery = async () => this.update(selector, newData, queryContext)

    return this.protectMutationQuery<E>(
      updateQuery,
      selector,
      queryContext,
      MutationQueryType.UPDATE,
    )
  }

  protected async deleteIfWithinConstraint(
    selector: FindConditions<E>,
    queryContext: CoreQueryContext,
  ): Promise<DeleteResult> {
    const deleteQuery = async () => this.delete(selector, queryContext)

    return this.protectMutationQuery<DeleteResult>(
      deleteQuery,
      selector,
      queryContext,
      MutationQueryType.DELETE,
    )
  }

  protected async protectMutationQuery<T>(
    query: () => Promise<T>,
    selector: FindConditions<E>,
    queryContext: CoreQueryContext,
    queryType: MutationQueryType,
  ): Promise<T> {
    const availableSetups = {
      [MutationQueryType.UPDATE]: async (
        query: SelectQueryBuilder<E>,
        queryContext: CoreQueryContext,
      ) => this.setupUpdateMutationQuery(query, queryContext),
      [MutationQueryType.DELETE]: async (
        query: SelectQueryBuilder<E>,
        queryContext: CoreQueryContext,
      ) => this.setupDeleteMutationQuery(query, queryContext),
    }
    const setup = availableSetups[queryType]

    const validationQuery = await this.getWithConstraint(selector, queryContext)
    const validationQueryAfterSetup = await setup(validationQuery, queryContext)
    const validationData = await validationQueryAfterSetup.getOne()
    if (!validationData) return

    return query()
  }

  protected async setupUpdateMutationQuery(
    query: SelectQueryBuilder<E>,
    _queryContext: CoreQueryContext,
  ): Promise<SelectQueryBuilder<E>> {
    return query
  }

  protected async setupDeleteMutationQuery(
    query: SelectQueryBuilder<E>,
    _queryContext: CoreQueryContext,
  ): Promise<SelectQueryBuilder<E>> {
    return query
  }

  protected changeConstraintInQueryContext(
    originalQueryContext: CoreQueryContext,
    constraint: Scope,
  ): CoreQueryContext {
    return {
      ...originalQueryContext,
      constraint,
    }
  }

  protected getFirstDayAfterLastWeek(): Date {
    const date = new Date()
    const firstDayAfterLastWeek = startOfWeek(date, {
      weekStartsOn: 6,
    })

    return firstDayAfterLastWeek
  }

  protected marshalEntityOrderAttributes(
    entityOrderAttributes?: EntityOrderAttributes[],
  ): OrderAttribute[] {
    if (!entityOrderAttributes) return []

    const marshalledOrderAttributes = entityOrderAttributes.map(([entity, orderAttributes]) =>
      this.repository.marshalEntityOrderAttributes(entity, orderAttributes),
    )

    return flatten(marshalledOrderAttributes)
  }

  protected abstract protectCreationQuery(
    query: CreationQuery<E>,
    data: Partial<I>,
    queryContext: CoreQueryContext,
  ): Promise<E[] | null>
}
