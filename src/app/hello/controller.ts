import { Controller, Get } from '@nestjs/common'

import HelloService from './service'

@Controller()
class HelloController {
  constructor(private readonly helloService: HelloService) {}

  @Get()
  getHello(): string {
    return this.helloService.getHello()
  }
}

export default HelloController
