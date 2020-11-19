import { Injectable } from '@nestjs/common'
import { omit } from 'lodash'

import { IConfidenceReport } from 'domain/objective-aggregate/confidence-report/dto'
import { IProgressReport } from 'domain/objective-aggregate/progress-report/dto'
import { User } from 'domain/user-aggregate/user/entities'

import { KeyResult } from './entities'
import KeyResultRepository from './repository'

export interface KeyResultLatestReport extends Partial<KeyResult> {
  progressReport: IProgressReport
  confidenceReport: IConfidenceReport
}

@Injectable()
class KeyResultService {
  relations = [['owner', 'user'], 'team', 'objective', 'progressReports', 'confidenceReports']
  order: Record<string, 'ASC' | 'DESC'> = {
    'progressReports.createdAt': 'DESC',
    'confidenceReports.createdAt': 'DESC',
  }

  constructor(private readonly keyResultRepository: KeyResultRepository) {}

  async getUserKeyResults(uid: User['id']): Promise<KeyResult[]> {
    const keyResults = await this.keyResultRepository.getAllKeyResultsWithSelector(
      { owner: uid },
      this.relations,
      this.order,
    )

    return keyResults
  }

  filterKeyResultToLatestReport(keyResult: KeyResult): KeyResultLatestReport {
    return {
      ...omit(keyResult, 'progressReports', 'confidenceReports'),
      progressReport: keyResult.progressReports[0],
      confidenceReport: keyResult.confidenceReports[0],
    }
  }
}

export default KeyResultService
