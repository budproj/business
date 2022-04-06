import { EntityRepository, WhereExpressionBuilder } from 'typeorm'

import { CoreEntityRepository } from '@core/core.repository'

import { Task } from './task.orm-entity'

@EntityRepository(Task)
export class TaskRepository extends CoreEntityRepository<Task> {
  public entityName = Task.name

  protected addTeamWhereExpression(query: WhereExpressionBuilder): WhereExpressionBuilder {
    return query
  }

  protected addOwnsWhereExpression(query: WhereExpressionBuilder): WhereExpressionBuilder {
    return query
  }
}
