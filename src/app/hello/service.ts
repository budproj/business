import { Injectable } from '@nestjs/common'

@Injectable()
class HelloService {
  getHello(): string {
    return 'Hello World!'
  }
}

export default HelloService
