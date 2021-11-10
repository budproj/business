import { Injectable, Logger } from '@nestjs/common'
import { CreateUserData, ManagementClient, User } from 'auth0'

import { AuthzConfigProvider } from '@config/authz/authz.provider'

@Injectable()
export class AuthzClientProvider {
  private readonly logger = new Logger(AuthzClientProvider.name)
  private readonly mgmtClient: ManagementClient

  constructor(private readonly config: AuthzConfigProvider) {
    this.mgmtClient = new ManagementClient({
      domain: this.config.domain,
      clientId: this.config.credentials.clientID,
      clientSecret: this.config.credentials.clientSecret,
    })
  }

  public get connection(): string {
    return this.config.connection
  }

  public async updateUser(userId: string, userData: Record<string, unknown>): Promise<User> {
    try {
      this.logger.debug(`Updating user ${userId}`)
      return await this.mgmtClient.updateUser({ id: userId }, userData)
    } catch (error: unknown) {
      this.logger.error(error)
      throw error
    }
  }

  public async newUser(data: CreateUserData): Promise<User> {
    try {
      this.logger.debug(`Creating new user`)
      return await this.mgmtClient.createUser(data)
    } catch (error: unknown) {
      this.logger.error(error)
      throw error
    }
  }
}
