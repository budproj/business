import { Injectable } from '@nestjs/common'

import { CreateUserFeedbackDTO } from '../dtos/create-user-feedback.dto'
import { UserFeedbackRepository } from '../repositories/user-feedback-repository'

@Injectable()
class UserFeedbackService {
  constructor(private readonly repository: UserFeedbackRepository) {}

  public async upsert<T extends Record<string, unknown>>(
    request: CreateUserFeedbackDTO,
  ): Promise<CreateUserFeedbackDTO> {
    return this.repository.upsertFeedback(request)
  }
}

export default UserFeedbackService
