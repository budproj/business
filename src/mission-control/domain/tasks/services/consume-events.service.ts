/* eslint-disable @typescript-eslint/no-floating-promises */
import { Injectable } from '@nestjs/common'

import { UserRepository } from '../repositories/user-repository.js'

@Injectable()
export class CosumeEventsService {
  constructor(
    // Private readonly producer: AssignRetrospectiveAnswerTask,
    private readonly userRepository: UserRepository,
  ) {}

  async execute() {
    // // Key Result Check In
    // const checkInFulfiller = new CheckInTaskFulfiller(taskRepository)
    // eventSubscriber.subscribe<CheckInEvent>(CHECK_IN_TASK_TEMPLATE_ID, async (event) => {
    //     await checkInFulfiller.ingest(event)
    // })
    // // Retrospective Answer
    // const retrospectiveAnswerFulfiller = new RetrospectiveAnswerTaskFulfiller(taskRepository)
    // eventSubscriber.subscribe<RetrospectiveAnswerEvent>(RETROSPECTIVE_ANSWER_TASK_TEMPLATE_ID, async (event) => {
    //     await retrospectiveAnswerFulfiller.ingest(event)
  }
}
