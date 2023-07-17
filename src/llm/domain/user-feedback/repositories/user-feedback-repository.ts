import { CreateUserFeedbackDTO } from '../dtos/create-user-feedback.dto'

export abstract class UserFeedbackRepository {
  abstract upsertFeedback(data: CreateUserFeedbackDTO): Promise<CreateUserFeedbackDTO>
}
