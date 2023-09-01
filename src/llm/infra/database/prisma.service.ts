import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common'

import { PrismaClient as LLMPrismaClient } from '@prisma/llm/generated'

@Injectable()
export class PrismaService extends LLMPrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect()
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close()
    })
  }
}
