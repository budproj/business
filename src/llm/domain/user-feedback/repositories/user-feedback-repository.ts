import { CreateUserFeedbackDTO } from '../dtos/create-user-feedback.dto'

export abstract class UserFeedbackRepository {
  abstract upsert(data: CreateUserFeedbackDTO): Promise<CreateUserFeedbackDTO>
}
