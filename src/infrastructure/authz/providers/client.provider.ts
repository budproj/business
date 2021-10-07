import { Injectable, Logger } from '@nestjs/common'
import { ManagementClient, User } from 'auth0'

import { AuthzConfigProvider } from '@config/authz/authz.provider'

@Injectable()
export class AuthzClientProvider {
  private readonly logger = new Logger(AuthzClientProvider.name)
  private readonly mgmtClient: ManagementClient

  constructor(config: AuthzConfigProvider) {
    this.mgmtClient = new ManagementClient({
      domain: config.domain,
      clientId: config.credentials.clientID,
      clientSecret: config.credentials.clientSecret,
    })
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
}
