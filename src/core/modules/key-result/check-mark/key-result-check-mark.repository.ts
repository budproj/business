import { EntityRepository, WhereExpression } from 'typeorm'

import { CoreEntityRepository } from '@core/core.repository'

import { KeyResultCheckMark } from './key-result-check-mark.orm-entity'

@EntityRepository(KeyResultCheckMark)
export class KeyResultCheckMarkRepository extends CoreEntityRepository<KeyResultCheckMark> {
  public entityName = KeyResultCheckMark.name

  protected addTeamWhereExpression(query: WhereExpression): WhereExpression {
    return query
  }

  protected addOwnsWhereExpression(query: WhereExpression): WhereExpression {
    return query
  }
}
