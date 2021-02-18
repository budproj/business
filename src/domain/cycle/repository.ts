import { EntityRepository, SelectQueryBuilder, WhereExpression } from 'typeorm'

import { CycleQueryOptions } from 'src/domain/cycle/types'
import { CONSTRAINT_TYPE, DomainEntityRepository } from 'src/domain/entity'
import { TeamDTO } from 'src/domain/team/dto'
import { Team } from 'src/domain/team/entities'
import { UserDTO } from 'src/domain/user/dto'

import { Cycle } from './entities'

export interface DomainCycleRepositoryInterface {
  findFromTeams: (teams: Team[], options?: CycleQueryOptions) => Promise<Cycle[]>
}

@EntityRepository(Cycle)
class DomainCycleRepository
  extends DomainEntityRepository<Cycle>
  implements DomainCycleRepositoryInterface {
  public async findFromTeams(teams: Team[], options?: CycleQueryOptions) {
    const teamIDs = teams.map((team) => team.id)
    const query = this.createQueryBuilder()
      .where(`${Cycle.name}.teamId in (:...teamIDs)`, { teamIDs })
      .limit(options?.limit ?? 0)

    const orderedQuery =
      options?.orderBy && options?.orderBy?.length > 0
        ? options.orderBy.reduce(
            (query, [field, direction]) => query.addOrderBy(`${Cycle.name}.${field}`, direction),
            query,
          )
        : query

    return orderedQuery.getMany()
  }

  protected setupOwnsQuery(query: SelectQueryBuilder<Cycle>) {
    return query.leftJoinAndSelect(`${Cycle.name}.team`, Team.name)
  }

  protected addTeamWhereExpression(
    query: WhereExpression,
    allowedTeams: Array<TeamDTO['id']>,
    constraintType: CONSTRAINT_TYPE = CONSTRAINT_TYPE.OR,
  ) {
    const constraintMethodName = this.selectConditionMethodNameBasedOnConstraintType(constraintType)

    return query[constraintMethodName](`${Cycle.name}.teamId IN (:...allowedTeams)`, {
      allowedTeams,
    })
  }

  protected addOwnsWhereExpression(
    query: WhereExpression,
    user: UserDTO,
    constraintType: CONSTRAINT_TYPE = CONSTRAINT_TYPE.OR,
  ) {
    const constraintMethodName = this.selectConditionMethodNameBasedOnConstraintType(constraintType)

    return query[constraintMethodName](`${Team.name}.ownerId = :userID`, {
      userID: user.id,
    })
  }
}

export default DomainCycleRepository
