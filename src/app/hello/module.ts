import { Module } from '@nestjs/common'

import HelloController from './controller'
import HelloService from './service'

@Module({
  controllers: [HelloController],
  providers: [HelloService],
})
class HelloModule {}

export default HelloModule
