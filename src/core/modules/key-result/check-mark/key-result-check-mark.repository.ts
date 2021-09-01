import { EntityRepository, WhereExpression } from 'typeorm'

import { CoreEntityRepository } from '@core/core.repository'

import { KeyResult } from '../key-result.orm-entity'

import { KeyResultCheckMark } from './key-result-check-mark.orm-entity'

@EntityRepository(KeyResultCheckMark)
export class KeyResultCheckMarkRepository extends CoreEntityRepository<KeyResultCheckMark> {
  public entityName = KeyResultCheckMark.name

  public async getFromObjective(objectiveID: string): Promise<KeyResultCheckMark[]> {
    return this.createQueryBuilder()
      .leftJoinAndSelect(`${KeyResultCheckMark.name}.keyResult`, `${KeyResult.name}`)
      .where(`${KeyResult.name}.objectiveId = :objectiveID`, { objectiveID })
      .getMany()
  }

  protected addTeamWhereExpression(query: WhereExpression): WhereExpression {
    return query
  }

  protected addOwnsWhereExpression(query: WhereExpression): WhereExpression {
    return query
  }
}
