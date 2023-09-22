import { Injectable } from '@nestjs/common'
import { OpenAiCompletion } from '@prisma/client'

import { GenerateOpenAiCompletionDTO } from 'src/llm/domain/open-ai/dtos/create-key-result-completion.dto'
import { OpenAICompletionRepository } from 'src/llm/domain/open-ai/repositories/open-ai-completion-repositorie'

import { PrismaService } from '../../prisma.service'

@Injectable()
export class PrismaOpenAiCompletionRepository implements OpenAICompletionRepository {
  constructor(private readonly prisma: PrismaService) {}
  async createCompletion(data: GenerateOpenAiCompletionDTO): Promise<OpenAiCompletion> {
    return this.prisma.openAiCompletion.create({ data })
  }

  async findCompletionById(id: string): Promise<OpenAiCompletion> {
    return this.prisma.openAiCompletion.findUnique({ where: { id } })
  }

  async updateCompletion(completionId, data: Partial<OpenAiCompletion>): Promise<OpenAiCompletion> {
    return this.prisma.openAiCompletion.update({ data, where: { id: completionId } })
  }
}
