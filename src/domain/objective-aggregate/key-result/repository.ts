import { Logger } from '@nestjs/common'
import { EntityRepository, ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm'

import { KeyResultDTO } from 'domain/objective-aggregate/key-result/dto'

import { KeyResult } from './entities'

@EntityRepository(KeyResult)
class KeyResultRepository extends Repository<KeyResult> {
  private readonly logger = new Logger(KeyResultRepository.name)
  private readonly defaultOrder = `${KeyResult.name}.updatedAt`
  private readonly allRelations: Array<[string, string] | string> = [
    ['owner', 'user'],
    'team',
    'objective',
    'progressReports',
    'confidenceReports',
  ]

  async selectManyWithRankAndRelations(
    selector: ObjectLiteral,
    rankSortColumn: string,
    relations: Array<[string, string] | string> = this.allRelations,
  ): Promise<KeyResult[]> {
    this.logger.debug({
      rankSortColumn,
      message: 'Using rankSortColumn to fetch key results',
    })

    const query = this.createQueryBuilder()
    const filteredQuery = query.where(selector)
    const joinedQuery = relations.reduce(this.reduceRelationsToSubQuery, filteredQuery)
    const orderedByRank = joinedQuery.orderBy(rankSortColumn)
    const orderedByDefault = orderedByRank.addOrderBy(this.defaultOrder, 'DESC')
    const data = await orderedByDefault.getMany()

    this.logger.debug({
      data,
      message: 'Selected many key results with rank and relations',
    })

    return data
  }

  reduceRelationsToSubQuery(
    query: SelectQueryBuilder<KeyResult>,
    subQuery: string[] | string,
  ): SelectQueryBuilder<KeyResult> {
    const isString = typeof subQuery === 'string'

    const entity = isString ? (subQuery as string) : subQuery[0]
    const alias = isString ? (subQuery as string) : subQuery[1]

    return query.leftJoinAndSelect(`${KeyResult.name}.${entity}`, alias)
  }

  async selectSingleByIDWithRelations(
    id: KeyResultDTO['id'],
    relations: Array<[string, string] | string> = this.allRelations,
  ): Promise<KeyResult> {
    const query = this.createQueryBuilder()
    const filteredQuery = query.where({ id })
    const joinedQuery = relations.reduce(this.reduceRelationsToSubQuery, filteredQuery)
    const data = await joinedQuery.getOne()

    this.logger.debug({
      data,
      message: `Selected key result ${id.toString()} with relations`,
    })

    return data
  }
}

export default KeyResultRepository
