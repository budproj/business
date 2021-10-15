import { EntityRepository, SelectQueryBuilder, WhereExpression } from 'typeorm'

import { CoreEntityRepository, NullableFilters } from '@core/core.repository'
import { ConstraintType } from '@core/enums/contrain-type.enum'
import { Cycle } from '@core/modules/cycle/cycle.orm-entity'
import { CycleInterface } from '@core/modules/cycle/interfaces/cycle.interface'
import { KeyResultCheckInInterface } from '@core/modules/key-result/check-in/key-result-check-in.interface'
import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'
import { ObjectiveInterface } from '@core/modules/objective/interfaces/objective.interface'
import { Objective } from '@core/modules/objective/objective.orm-entity'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { Team } from '@core/modules/team/team.orm-entity'
import { UserInterface } from '@core/modules/user/user.interface'
import { OrderAttribute } from '@core/types/order-attribute.type'

import { KeyResultInterface } from './interfaces/key-result.interface'
import { KeyResult } from './key-result.orm-entity'

export type KeyResultRelationFilterProperties = {
  keyResultCheckIn?: Partial<KeyResultCheckInInterface>
  keyResult?: Partial<KeyResultInterface>
  objective?: Partial<ObjectiveInterface>
  cycle?: Partial<CycleInterface>
  team?: Partial<TeamInterface>
}

@EntityRepository(KeyResult)
export class KeyResultRepository extends CoreEntityRepository<KeyResult> {
  public readonly entityName = KeyResult.name

  public async findWithRelationFilters(
    filterProperties: KeyResultRelationFilterProperties,
    nullableFilters?: NullableFilters,
    orderAttributes: OrderAttribute[] = [],
  ): Promise<KeyResult[]> {
    const filters = this.buildFilters(filterProperties, nullableFilters)

    const query = this.createQueryBuilder()
      .where(filters.query, filters.variables)
      .leftJoinAndSelect(`${KeyResult.name}.checkIns`, KeyResultCheckIn.name)
      .leftJoinAndSelect(`${KeyResult.name}.objective`, Objective.name)
      .leftJoinAndSelect(`${KeyResult.name}.team`, Team.name)
      .leftJoinAndSelect(`${Objective.name}.cycle`, Cycle.name)

    orderAttributes.map(([attribute, direction], index) => {
      return index === 0
        ? query.orderBy(attribute, direction)
        : query.addOrderBy(attribute, direction)
    })

    return query.getMany()
  }

  public async findByIdsRanked(ids: Array<KeyResultInterface['id']>, rank: string) {
    const query = this.createQueryBuilder()
    const filteredQuery = query.where(`${KeyResult.name}.id IN (:...ids)`, { ids })
    const orderedQuery = filteredQuery.orderBy(rank)

    return orderedQuery.getMany()
  }

  public async addUserToSupportTeam(keyResultId: string, userId: string) {
    const query = this.createQueryBuilder()

    return query.relation(KeyResult, 'supportTeamMembers')
      .of(keyResultId)
      .add(userId)
  }

  public async removeUserToSupportTeam(keyResultId: string, userId: string) {
    const query = this.createQueryBuilder()

    return query.relation(KeyResult, 'supportTeamMembers')
      .of(keyResultId)
      .remove(userId)
  }

  protected setupTeamQuery(query: SelectQueryBuilder<KeyResult>) {
    return query.leftJoinAndSelect(`${KeyResult.name}.team`, Team.name)
  }

  protected addTeamWhereExpression(
    query: WhereExpression,
    allowedTeams: Array<TeamInterface['id']>,
    constraintType: ConstraintType = ConstraintType.OR,
  ) {
    const constraintMethodName = this.selectConditionMethodNameBasedOnConstraintType(constraintType)

    return query[constraintMethodName](`${Team.name}.id IN (:...allowedTeams)`, {
      allowedTeams,
    })
  }

  protected addOwnsWhereExpression(
    query: WhereExpression,
    user: UserInterface,
    constraintType: ConstraintType = ConstraintType.OR,
  ) {
    const constraintMethodName = this.selectConditionMethodNameBasedOnConstraintType(constraintType)

    return query[constraintMethodName](`${KeyResult.name}.ownerId = :userID`, {
      userID: user.id,
    })
  }
}
