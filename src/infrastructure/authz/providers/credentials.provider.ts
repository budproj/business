import { Injectable } from '@nestjs/common'

import { CredentialsAdapter } from '@adapters/credentials/credentials.adapter'
import { NewCredentialData, Credential } from '@adapters/credentials/credentials.interface'

import { AuthzClientProvider } from './client.provider'

@Injectable()
export class AuthzCredentialsProvider implements CredentialsAdapter {
  constructor(private readonly client: AuthzClientProvider) {}

  public generatePassword(): string {
    return Math.random().toString(36).slice(-16)
  }

  public async create(data: NewCredentialData): Promise<Credential> {
    const dataWithConnection = {
      ...data,
      connection: this.client.connection,
    }

    const user = await this.client.newUser(dataWithConnection)

    return { sub: user.user_id }
  }

  public async blockUser(userID: string): Promise<boolean> {
    const updatedUser = await this.client.updateUser(userID, { blocked: true })

    return updatedUser.blocked
  }

  public async updateEmail(userID: string, email: string): Promise<boolean> {
    const updatedUser = await this.client.updateUser(userID, { email })

    return updatedUser.email === email
  }
}
