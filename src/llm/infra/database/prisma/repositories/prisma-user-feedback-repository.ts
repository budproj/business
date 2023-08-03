import { Injectable } from '@nestjs/common'

import { CreateUserFeedbackDTO } from 'src/llm/domain/user-feedback/dtos/create-user-feedback.dto'
import { UserFeedbackRepository } from 'src/llm/domain/user-feedback/repositories/user-feedback-repository'

import { PrismaService } from '../../prisma.service'

@Injectable()
export class PrismaUserFeedbackRepository implements UserFeedbackRepository {
  constructor(private readonly prisma: PrismaService) {}
  async upsert(data: CreateUserFeedbackDTO): Promise<CreateUserFeedbackDTO> {
    return this.prisma.userCompletionFeedback.upsert({
      where: {
        userId_completionId: {
          completionId: data.completionId,
          userId: data.userId,
        },
      },
      update: {
        value: data.value,
      },
      create: {
        userId: data.userId,
        completionId: data.completionId,
        value: data.value,
        vendor: data.vendor,
      },
    })
  }
}
