import { EntityRepository, SelectQueryBuilder, WhereExpression } from 'typeorm'

import { CoreEntityRepository, NullableFilters } from '@core/core.repository'
import { ConstraintType } from '@core/enums/contrain-type.enum'
import { Cycle } from '@core/modules/cycle/cycle.orm-entity'
import { CycleInterface } from '@core/modules/cycle/interfaces/cycle.interface'
import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { ObjectiveInterface } from '@core/modules/objective/interfaces/objective.interface'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { Team } from '@core/modules/team/team.orm-entity'
import { UserInterface } from '@core/modules/user/user.interface'
import { User } from '@core/modules/user/user.orm-entity'
import { OrderAttribute } from '@core/types/order-attribute.type'

import { Objective } from './objective.orm-entity'

export type ObjectiveRelationFilterProperties = {
  objective?: Partial<ObjectiveInterface>
  cycle?: Partial<CycleInterface>
  keyResult?: Partial<KeyResultInterface>
}

@EntityRepository(Objective)
export class ObjectiveRepository extends CoreEntityRepository<Objective> {
  public entityName = Objective.name

  public async findWithRelationFilters(
    filterProperties: ObjectiveRelationFilterProperties,
    nullableFilters?: NullableFilters,
    orderAttributes: OrderAttribute[] = [],
  ): Promise<Objective[]> {
    const filters = this.buildFilters(filterProperties, nullableFilters)

    const query = this.createQueryBuilder()
      .where(filters.query, filters.variables)
      .leftJoinAndSelect(`${Objective.name}.cycle`, Cycle.name)
      .leftJoinAndSelect(`${Objective.name}.keyResults`, KeyResult.name)

    orderAttributes.map(([attribute, direction], index) => {
      return index === 0
        ? query.orderBy(attribute, direction)
        : query.addOrderBy(attribute, direction)
    })

    return query.getMany()
  }

  protected setupTeamQuery(query: SelectQueryBuilder<Objective>) {
    return query
      .leftJoinAndSelect(`${Objective.name}.owner`, User.name)
      .leftJoinAndSelect(`${User.name}.teams`, Team.name)
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

    return query[constraintMethodName](`${Objective.name}.ownerId = :userID`, {
      userID: user.id,
    })
  }
}
