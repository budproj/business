import { Injectable } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { Any, DeleteResult, SelectQueryBuilder } from 'typeorm'

import { EventPublisher } from '@core/common/messaging/base-scenarios/abstract'
import { CheckInEvent } from '@core/common/messaging/base-scenarios/checkin.event'
import { CHECK_IN_TASK_TEMPLATE_ID } from '@core/common/mission-control/tasks-template/constants'
import { CoreEntityProvider } from '@core/entity.provider'
import { Sorting } from '@core/enums/sorting'
import { CoreQueryContext } from '@core/interfaces/core-query-context.interface'
import { TeamProvider } from '@core/modules/team/team.provider'
import { UserInterface } from '@core/modules/user/user.interface'
import { CreationQuery } from '@core/types/creation-query.type'

import { KeyResultTimelineQueryResult } from '../interfaces/key-result-timeline-query-result.interface'
import { KeyResultInterface } from '../interfaces/key-result.interface'
import { KeyResultProvider } from '../key-result.provider'

import { MAX_PERCENTAGE_PROGRESS, MIN_PERCENTAGE_PROGRESS } from './key-result-check-in.constants'
import { KeyResultCheckInInterface } from './key-result-check-in.interface'
import { KeyResultCheckIn } from './key-result-check-in.orm-entity'
import { KeyResultCheckInRepository } from './key-result-check-in.repository'

@Injectable()
export class KeyResultCheckInProvider extends CoreEntityProvider<
  KeyResultCheckIn,
  KeyResultCheckInInterface
> {
  private keyResultProvider: KeyResultProvider

  constructor(
    protected readonly repository: KeyResultCheckInRepository,
    private readonly moduleReference: ModuleRef,
    private readonly team: TeamProvider,
    private readonly fulfillerTaskPublisher: EventPublisher,
  ) {
    super(KeyResultCheckInProvider.name, repository)
  }

  static minmax(value: number, min: number, max: number): number {
    const isBetween = value >= min && value <= max
    const isLess = value < min

    const minOrMax = isLess ? min : max

    return isBetween ? value : minOrMax
  }

  public async getLatestFromUsers(users: UserInterface[]): Promise<KeyResultCheckIn> {
    const userIDs = users.map((user) => user.id)
    if (!userIDs || userIDs.length === 0) return

    const selector = {
      userId: Any(userIDs),
    }

    const latestCheckInArray = await this.repository.find({
      where: selector,
      take: 1,
      order: {
        createdAt: Sorting.DESC,
      },
    })

    return latestCheckInArray[0]
  }

  public async getLatestFromKeyResult(keyResult: KeyResultInterface): Promise<KeyResultCheckIn> {
    const date = new Date()

    return this.getLatestFromKeyResultAtDate(keyResult.id, date)
  }

  public async getLatestFromKeyResultAtDate(
    keyResultID: string,
    snapshot: Date,
  ): Promise<KeyResultCheckIn> {
    return this.repository.getLatestFromDateForKeyResult(snapshot, keyResultID)
  }

  public getProgressFromValue(keyResult: KeyResultInterface, value?: number): number {
    const { initialValue, goal } = keyResult
    value ??= initialValue

    const progress = ((value - initialValue) * 100) / (goal - initialValue)
    return this.limitProgress(progress)
  }

  public limitProgress(progress: number): number {
    return KeyResultCheckInProvider.minmax(
      progress,
      MIN_PERCENTAGE_PROGRESS,
      MAX_PERCENTAGE_PROGRESS,
    )
  }

  public async getForTimelineEntries(
    entries: KeyResultTimelineQueryResult[],
  ): Promise<KeyResultCheckIn[]> {
    const checkInIDs = entries.map((entry) => entry.id)
    return this.repository.findByIds(checkInIDs)
  }

  public async createCheckIn(
    checkIn: Partial<KeyResultCheckInInterface>,
  ): Promise<KeyResultCheckIn[]> {
    const createdCheckin = await this.create(checkIn)

    const {
      keyResult: { id: keyResultId, teamId },
    } = await this.repository.findOne(createdCheckin[0].id, {
      relations: ['keyResult', 'user'],
    })

    const { ownerId } = await this.keyResultProvider.getFromID(createdCheckin[0].keyResultId)

    const [companie] = await this.team.getAscendantsByIds([teamId], {})

    const messageInterface = {
      userId: ownerId,
      companyId: companie.id,
      date: Date.now(),
      payload: {
        teamId,
        keyResultId,
      },
    }

    await this.fulfillerTaskPublisher.publish<CheckInEvent>(CHECK_IN_TASK_TEMPLATE_ID, {
      ...messageInterface,
    })

    return createdCheckin
  }

  public async deleteFromObjective(objectiveID: string): Promise<DeleteResult> {
    const objectiveCheckIns = await this.repository.getFromObjective(objectiveID)
    const objectiveCheckInIDs = objectiveCheckIns.map((comment) => comment.id)

    return this.delete({
      id: Any(objectiveCheckInIDs),
    })
  }

  protected onModuleInit(): void {
    this.keyResultProvider = this.moduleReference.get(KeyResultProvider)
  }

  protected async protectCreationQuery(
    query: CreationQuery<KeyResultCheckIn>,
    data: Partial<KeyResultCheckInInterface>,
    queryContext: CoreQueryContext,
  ): Promise<KeyResultCheckIn[]> {
    const selector = { id: data.keyResultId }

    const validationData = await this.keyResultProvider.getOneWithConstraint(selector, queryContext)
    if (!validationData) return

    return query()
  }

  protected async setupDeleteMutationQuery(
    query: SelectQueryBuilder<KeyResultCheckIn>,
  ): Promise<SelectQueryBuilder<KeyResultCheckIn>> {
    const currentKeyResultCheckIn = await query
      .leftJoinAndSelect(`${KeyResultCheckIn.name}.keyResult`, 'keyResult')
      .getOne()
    if (!currentKeyResultCheckIn) return query

    const { keyResult } = currentKeyResultCheckIn
    const latestCheckIn = await this.getLatestFromKeyResult(keyResult)

    return query.andWhere(`${KeyResultCheckIn.name}.id = :latestCheckInID`, {
      latestCheckInID: latestCheckIn.id,
    })
  }
}
