import { Controller, Get } from "@nestjs/common";
import { Stopwatch } from "@lib/logger/pino.decorator";

@Controller('/ping')
export class PingController {

  @Stopwatch()
  @Get('')
  public async ping() {
    return { pong: Date.now() };
  }
}
