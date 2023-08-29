import { Injectable } from '@nestjs/common'

import { UserProvider } from '@core/modules/user/user.provider'

@Injectable()
export class UserMissionControlRepository {
  constructor(private readonly userProvier: UserProvider) {}

  async test() {
    const users = await this.userProvier.getMany({ firstName: 'Rick' })

    return users
  }
}
