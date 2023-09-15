import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common'

import { PrismaClient as MissionControlPrismaClient } from '@prisma/mission-control/generated'

@Injectable()
export class PrismaService extends MissionControlPrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect()
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close()
    })
  }
}
