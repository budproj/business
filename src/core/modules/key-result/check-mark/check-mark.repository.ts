import { EntityRepository, WhereExpression } from 'typeorm'

import { CoreEntityRepository } from '@core/core.repository'

import { CheckMark } from './check-mark.orm-entity'

@EntityRepository(CheckMark)
export class CheckMarkRepository extends CoreEntityRepository<CheckMark> {
  public entityName = CheckMark.name

  protected addTeamWhereExpression(query: WhereExpression): WhereExpression {
    return query
  }

  protected addOwnsWhereExpression(query: WhereExpression): WhereExpression {
    return query
  }
}
