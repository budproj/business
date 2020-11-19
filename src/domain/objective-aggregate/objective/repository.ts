import { EntityRepository, Repository } from 'typeorm'

import { CycleDTO } from 'domain/company-aggregate/cycle/dto'

import { Objective } from './entities'

@EntityRepository(Objective)
class ObjectiveRepository extends Repository<Objective> {
  async selectRelatedCycle(id: Objective['id']): Promise<CycleDTO> {
    const query = this.createQueryBuilder()
    const selectedQuery = query.where({ id })
    const joinedQuery = selectedQuery.leftJoinAndSelect(`${Objective.name}.cycle`, 'cycle')
    const objective = await joinedQuery.getOne()

    return objective.cycle
  }
}

export default ObjectiveRepository
