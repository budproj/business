import { Injectable } from '@nestjs/common'
import { sum } from 'lodash'
import { Any } from 'typeorm'

import { DOMAIN_QUERY_ORDER } from 'src/domain/constants'
import { DomainEntityService, DomainQueryContext } from 'src/domain/entity'
import {
  MAX_PERCENTAGE_PROGRESS,
  MIN_PERCENTAGE_PROGRESS,
} from 'src/domain/key-result/check-in/constants'
import { KeyResultCheckInDTO } from 'src/domain/key-result/check-in/dto'
import { KeyResultCheckIn } from 'src/domain/key-result/check-in/entities'
import { KEY_RESULT_FORMAT } from 'src/domain/key-result/constants'
import { KeyResultDTO } from 'src/domain/key-result/dto'
import { KeyResult } from 'src/domain/key-result/entities'
import { UserDTO } from 'src/domain/user/dto'

import DomainKeyResultCheckInRepository from './repository'

export interface DomainKeyResultCheckInServiceInterface {
  getLatestFromUsers: (users: UserDTO[]) => Promise<KeyResultCheckIn | null>
  getLatestFromKeyResult: (keyResult: KeyResultDTO) => Promise<KeyResultCheckIn | null>
  getLatestFromKeyResultAtDate: (
    keyResult: KeyResultDTO,
    date: Date,
  ) => Promise<KeyResultCheckIn | null>
  transformCheckInToPercentage: (
    checkIn: KeyResultCheckIn,
    keyResult: KeyResult,
  ) => KeyResultCheckIn
  limitPercentageCheckIn: (checkIn: KeyResultCheckIn) => KeyResultCheckIn
  calculateAverageProgressFromCheckInList: (
    checkIns: KeyResultCheckIn[],
  ) => KeyResultCheckInDTO['progress']
}

@Injectable()
class DomainKeyResultCheckInService extends DomainEntityService<
  KeyResultCheckIn,
  KeyResultCheckInDTO
> {
  constructor(public readonly repository: DomainKeyResultCheckInRepository) {
    super(repository, DomainKeyResultCheckInService.name)
  }

  public async getLatestFromUsers(users: UserDTO[]) {
    const userIDs = users.map((user) => user.id)

    const selector = {
      userId: Any(userIDs),
    }
    const options = {
      orderBy: {
        createdAt: DOMAIN_QUERY_ORDER.DESC,
      },
    }

    const latestCheckIn = await this.getOne(selector, undefined, options)

    return latestCheckIn
  }

  public async getLatestFromKeyResult(keyResult: KeyResultDTO) {
    const date = new Date()
    const checkIn = await this.repository.getLatestFromDateForKeyResult(date, keyResult)

    return checkIn
  }

  public async getLatestFromKeyResultAtDate(keyResult: KeyResultDTO, snapshot: Date) {
    const checkIn = await this.repository.getLatestFromDateForKeyResult(snapshot, keyResult)

    return checkIn
  }

  public transformCheckInToPercentage(checkIn: KeyResultCheckIn, keyResult: KeyResult) {
    if (keyResult.format === KEY_RESULT_FORMAT.PERCENTAGE) return checkIn

    const { initialValue, goal } = keyResult
    const { progress } = checkIn

    const percentageProgress = ((progress - initialValue) * 100) / (goal - initialValue)
    const normalizedCheckIn: KeyResultCheckIn = {
      ...checkIn,
      progress: percentageProgress,
    }

    return normalizedCheckIn
  }

  public limitPercentageCheckIn(checkIn: KeyResultCheckIn) {
    const limitedProgress = this.minmax(
      checkIn.progress,
      MIN_PERCENTAGE_PROGRESS,
      MAX_PERCENTAGE_PROGRESS,
    )

    const limitedCheckIn: KeyResultCheckIn = {
      ...checkIn,
      progress: limitedProgress,
    }

    return limitedCheckIn
  }

  public calculateAverageProgressFromCheckInList(checkIns: KeyResultCheckIn[]) {
    const progressList = checkIns.map((checkIn) => checkIn?.progress ?? 0)
    const averageProgress = sum(progressList) / progressList.length

    return averageProgress
  }

  protected async createIfUserIsInCompany(
    _data: Partial<KeyResultCheckIn>,
    _queryContext: DomainQueryContext,
  ) {
    return {} as any
  }

  protected async createIfUserIsInTeam(
    _data: Partial<KeyResultCheckIn>,
    _queryContext: DomainQueryContext,
  ) {
    return {} as any
  }

  protected async createIfUserOwnsIt(
    _data: Partial<KeyResultCheckIn>,
    _queryContext: DomainQueryContext,
  ) {
    return {} as any
  }

  private minmax(value: number, min: number, max: number) {
    const isBetween = value >= min && value <= max
    const isLess = value < min

    const minOrMax = isLess ? min : max

    return isBetween ? value : minOrMax
  }
}

export default DomainKeyResultCheckInService
