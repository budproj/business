import { Injectable, Logger } from '@nestjs/common'

@Injectable()
class UserAggregateService {
  private readonly logger = new Logger(UserAggregateService.name)
}

export default UserAggregateService
