import { Injectable } from '@nestjs/common'

import { CreateUserFeedbackDTO } from '../dtos/create-user-feedback.dto'
import { UserFeedbackRepository } from '../repositories/user-feedback-repository'

@Injectable()
class UserFeedbackService {
  constructor(private readonly repository: UserFeedbackRepository) {}

  public async upsert(request: CreateUserFeedbackDTO): Promise<CreateUserFeedbackDTO> {
    return this.repository.upsert(request)
  }
}

export default UserFeedbackService
