import { Injectable } from '@nestjs/common'

import { UserProvider } from './modules/user/user.provider'

@Injectable()
export class CoreProvider {
  constructor(public user: UserProvider) {}
}
