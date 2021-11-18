import { OnModuleInit } from '@nestjs/common'
import { connect } from 'nats'

export class NatsProvider implements OnModuleInit {
  connection: any

  async onModuleInit() {
    this.connection = await connect({ servers: 'localhost:4222' })
    this.connection.subscribe('test', {
      callback: this.demo,
    })
  }

  protected demo(error, data) {
    console.log(error, data)
  }
}
