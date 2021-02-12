import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { keyBy, snakeCase } from 'lodash'
import { getManager } from 'typeorm'

import { KeyResultDTO } from 'src/domain/key-result/dto'

import { DomainServiceGetOptions } from '../entity'

import { KeyResultCheckIn } from './check-in/entities'
import DomainKeyResultCheckInService from './check-in/service'
import { KeyResultComment } from './comment/entities'
import DomainKeyResultCommentService from './comment/service'

export type DomainKeyResultTimelineGetOptions = DomainServiceGetOptions<
  KeyResultCheckIn | KeyResultComment
>

export interface DomainKeyResultTimelineOrderEntry {
  id: KeyResultCheckIn['id']
  createdAt: KeyResultCheckIn['createdAt']
  entity: 'KeyResultCheckIn' | 'KeyResultComment'
}

export interface DomainKeyResultTimelineServiceInterface {
  buildUnionQuery: (
    keyResult: KeyResultDTO,
    options: DomainKeyResultTimelineGetOptions,
  ) => Promise<DomainKeyResultTimelineOrderEntry[]>
  getEntriesForTimelineOrder: (
    timelineOrder: DomainKeyResultTimelineOrderEntry[],
  ) => Promise<Array<KeyResultCheckIn | KeyResultComment>>
}

@Injectable()
class DomainKeyResultTimelineService implements DomainKeyResultTimelineServiceInterface {
  constructor(
    @Inject(forwardRef(() => DomainKeyResultCheckInService))
    public readonly checkIn: DomainKeyResultCheckInService,
    @Inject(forwardRef(() => DomainKeyResultCommentService))
    public readonly comment: DomainKeyResultCommentService,
  ) {}

  public async buildUnionQuery(
    keyResult: KeyResultDTO,
    options: DomainKeyResultTimelineGetOptions,
  ) {
    const columns = `id, created_at`
    const entityColumnName = 'entity'
    const keyResultIDColumnName = 'key_result_id'

    const keyResultCheckInName = KeyResultCheckIn.name
    const keyResultCheckInTableName = snakeCase(keyResultCheckInName)

    const keyResultCommentName = KeyResultComment.name
    const keyResultCommentTableName = snakeCase(keyResultCommentName)

    const query = `
      SELECT ${columns}, '${keyResultCheckInName}' as ${entityColumnName}
        FROM ${keyResultCheckInTableName}
        WHERE ${keyResultCheckInTableName}.${keyResultIDColumnName}='${keyResult.id}'

      UNION ALL

      SELECT ${columns}, '${keyResultCommentName}' as ${entityColumnName}
        FROM ${keyResultCommentTableName}
        WHERE ${keyResultCommentTableName}.${keyResultIDColumnName}='${keyResult.id}'

      ORDER BY created_at ${options.orderBy?.createdAt ?? 'DESC'}
      OFFSET ${options.offset ?? 0}
      ${options.limit ? `LIMIT ${options.limit}` : ''}
    `

    const manager = getManager()
    const result: DomainKeyResultTimelineOrderEntry[] = await manager.query(query)

    return result
  }

  public async getEntriesForTimelineOrder(timelineOrder: DomainKeyResultTimelineOrderEntry[]) {
    const checkInEntries = timelineOrder.filter((entry) => entry.entity === KeyResultCheckIn.name)
    const commentEntries = timelineOrder.filter((entry) => entry.entity === KeyResultComment.name)

    const checkIns = await this.checkIn.getForTimelineEntries(checkInEntries)
    const comments = await this.comment.getForTimelineEntries(commentEntries)

    const entriesHashmap = {
      [KeyResultCheckIn.name]: keyBy(checkIns, 'id'),
      [KeyResultComment.name]: keyBy(comments, 'id'),
    }

    const timeline = timelineOrder.map((entry) => entriesHashmap[entry.entity][entry.id])

    return timeline
  }
}

export default DomainKeyResultTimelineService
