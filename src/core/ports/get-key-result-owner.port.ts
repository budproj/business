import { Injectable } from '@nestjs/common'

import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { User } from '@core/modules/user/user.orm-entity'
import { UserProvider } from '@core/modules/user/user.provider'

import { Port } from './base.interface'

@Injectable()
export class GetKeyResultOwnerPort implements Port<Promise<User>> {
  constructor(private readonly user: UserProvider) {}

  public async execute(keyResult: KeyResult): Promise<User> {
    const user = await this.user.getFromID(keyResult.ownerId)

    return user
  }
}
