import { EntityRepository, Repository } from 'typeorm'

import { KeyResultView } from './entities'

export type UpdateWithConditionsOptions = Partial<Record<keyof KeyResultView, unknown>>

@EntityRepository(KeyResultView)
class KeyResultViewRepository extends Repository<KeyResultView> {
  async updateWithConditions(
    newData: Partial<KeyResultView>,
    conditions: UpdateWithConditionsOptions,
  ): Promise<KeyResultView> {
    const query = this.createQueryBuilder()
    const updateQuery = query.update(KeyResultView)
    const setQuery = updateQuery.set(newData)
    const filteredQuery = setQuery.where(conditions)

    await filteredQuery.execute()
    const updatedData = await this.findOne({ where: conditions })

    return updatedData
  }
}

export default KeyResultViewRepository
