import { Injectable } from '@nestjs/common'
import { keyBy, snakeCase } from 'lodash'
import { getManager } from 'typeorm'

import { GetOptions } from '@core/interfaces/get-options'

import { KeyResultCheckIn } from './check-in/key-result-check-in.orm-entity'
import { KeyResultCheckInProvider } from './check-in/key-result-check-in.provider'
import { KeyResultComment } from './comment/key-result-comment.orm-entity'
import { KeyResultCommentProvider } from './comment/key-result-comment.provider'
import { KeyResultTimelineQueryResult } from './interfaces/key-result-timeline-query-result.interface'
import { KeyResultInterface } from './interfaces/key-result.interface'
import { KeyResultTimelineEntry } from './types/key-result-timeline-entry.type'

@Injectable()
export class KeyResultTimelineProvider {
  constructor(
    public readonly keyResultCheckIn: KeyResultCheckInProvider,
    public readonly keyResultComment: KeyResultCommentProvider,
  ) {}

  public async buildUnionQuery(
    keyResult: KeyResultInterface,
    options: GetOptions<KeyResultCheckIn | KeyResultComment>,
  ): Promise<KeyResultTimelineQueryResult[]> {
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
    const result = await manager.query(query)

    return result
  }

  public async getEntriesForTimelineOrder(
    timelineQueryResult: KeyResultTimelineQueryResult[],
  ): Promise<KeyResultTimelineEntry[]> {
    const keyResultCheckInEntries = timelineQueryResult.filter(
      (entry) => entry.entity === KeyResultCheckIn.name,
    )
    const keyResultCommentEntries = timelineQueryResult.filter(
      (entry) => entry.entity === KeyResultComment.name,
    )

    const keyResultCheckIns = await this.keyResultCheckIn.getForTimelineEntries(
      keyResultCheckInEntries,
    )
    const keyResultComments = await this.keyResultComment.getForTimelineEntries(
      keyResultCommentEntries,
    )

    const entriesHashmap = {
      [KeyResultCheckIn.name]: keyBy(keyResultCheckIns, 'id'),
      [KeyResultComment.name]: keyBy(keyResultComments, 'id'),
    }

    const timeline = timelineQueryResult.map((entry) => entriesHashmap[entry.entity][entry.id])

    return timeline
  }
}
