import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { NATSConfigInterface } from '@config/tasks/tasks.interface'

@Injectable()
export class TasksConfigProvider {
  constructor(private readonly configService: ConfigService) {}

  get nats(): NATSConfigInterface {
    return this.configService.get<NATSConfigInterface>('tasks.nats')
  }
}
