import { Injectable } from '@nestjs/common'

import { CredentialsAdapter } from '@adapters/credentials/credentials.adapter'

import { AuthzClientProvider } from './client.provider'

@Injectable()
export class AuthzCredentialsProvider implements CredentialsAdapter {
  constructor(private readonly client: AuthzClientProvider) {}

  public async blockUser(userID: string): Promise<boolean> {
    const updatedUser = await this.client.updateUser(userID, { blocked: true })

    return updatedUser.blocked
  }
}
