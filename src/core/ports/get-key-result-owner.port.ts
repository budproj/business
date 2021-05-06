import { Injectable } from '@nestjs/common'

import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { User } from '@core/modules/user/user.orm-entity'
import { UserProvider } from '@core/modules/user/user.provider'

import { Port } from './base.interface'

@Injectable()
export class GetKeyResultOwnerPort implements Port<Promise<User>> {
  constructor(private readonly user: UserProvider) {}

  public async execute(keyResult: KeyResultInterface): Promise<User> {
    const user = await this.user.getFromID(keyResult.ownerId)

    return user
  }
}
