import { uniqBy } from 'lodash'
import { EntityTarget, getRepository, ObjectLiteral, Repository } from 'typeorm'

import { Cycle } from 'src/domain/cycle/entities'
import { KeyResultCheckIn } from 'src/domain/key-result/check-in/entities'
import { KeyResultComment } from 'src/domain/key-result/comment/entities'
import { KeyResultCustomList } from 'src/domain/key-result/custom-list/entities'
import { KeyResult } from 'src/domain/key-result/entities'
import { Objective } from 'src/domain/objective/entities'
import { Team } from 'src/domain/team/entities'
import { User } from 'src/domain/user/entities'

export const testConfig = {
  type: 'sqlite' as any,
  database: ':memory:',
  dropSchema: true,
  synchronize: true,
  logging: false,
  entities: [
    Cycle,
    KeyResult,
    KeyResultCheckIn,
    KeyResultCustomList,
    KeyResultComment,
    Objective,
    Team,
    User,
  ],
}

export interface TypeORMSeedInterface<T extends ObjectLiteral> {
  Entity: EntityTarget<T>
  seed: () => T

  create: (numberOfRecords?: number) => Promise<T[]>
  // Reset: () => Promise<void>
}

export interface TypeORMSeedEntityObjectLiteral extends ObjectLiteral {
  id: string
}

export class TypeORMSeed<T extends TypeORMSeedEntityObjectLiteral>
  implements TypeORMSeedInterface<T> {
  public readonly Entity: EntityTarget<T>
  public readonly seed: () => T
  private readonly repository: Repository<T>
  private createdEntities: T[] = []

  constructor(Entity: EntityTarget<T>, seed: () => T) {
    this.Entity = Entity
    this.seed = seed
    this.repository = getRepository<T>(Entity)
  }

  public async create(numberOfRecords = 1) {
    const seedRecords = [...new Array(numberOfRecords)].map(() => this.seed())
    const createdRecordResults = await this.repository.insert(seedRecords)

    const createdIDs = createdRecordResults.identifiers.map((record) => record.id)
    const createdEntities = await this.repository.findByIds(createdIDs)

    this.createdEntities = uniqBy([...this.createdEntities, createdEntities], 'id') as T[]

    return createdEntities
  }

  // Public async reset() {
  //   const deletePromises = this.createdEntities.map((entity) =>
  //     this.repository.remove({ id: entity.id }),
  //   )
  //
  //   await Promise.all(deletePromises)
  // }
}
