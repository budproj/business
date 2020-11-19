import { Injectable } from '@nestjs/common'
import { omit } from 'lodash'
import { ObjectLiteral, OrderByCondition } from 'typeorm'

import { User } from 'domain/user-aggregate/user/entities'

import { IConfidenceReport } from '../confidence-report/dto'
import { IProgressReport } from '../progress-report/dto'

import { KeyResult } from './entities'
import KeyResultRepository from './repository'

export interface KeyResultsWithLatestReport extends Partial<KeyResult> {
  latestProgressReport: IProgressReport
  latestConfidenceReport: IConfidenceReport
}

@Injectable()
class KeyResultService {
  allRelations: Array<[string, string] | string>

  constructor(private readonly repository: KeyResultRepository) {
    this.allRelations = [
      ['owner', 'user'],
      'team',
      'objective',
      'progressReports',
      'confidenceReports',
    ]
  }

  async getFromOwnerWithRelationsAndLatestReports(
    owner: User['id'],
  ): Promise<KeyResultsWithLatestReport[]> {
    const selector: ObjectLiteral = { owner }
    const relations = this.allRelations
    const order: OrderByCondition = {
      'progressReports.createdAt': 'DESC',
      'confidenceReports.createdAt': 'DESC',
    }

    const keyResults = await this.repository.selectManyWithSelectorRelationsAndOrder(
      selector,
      relations,
      order,
    )
    const keyResultsWithLatestReport = keyResults.map(this.filterLatestReports)

    return keyResultsWithLatestReport
  }

  filterLatestReports(keyResult: KeyResult): KeyResultsWithLatestReport {
    return {
      ...omit(keyResult, ['progressReports', 'confidenceReports']),
      latestProgressReport: keyResult.progressReports[0],
      latestConfidenceReport: keyResult.confidenceReports[0],
    }
  }
}

export default KeyResultService
