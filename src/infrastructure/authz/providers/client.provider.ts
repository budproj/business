import { Injectable, Logger } from '@nestjs/common'
import { AuthenticationClient, CreateUserData, ManagementClient, User } from 'auth0'

import { AuthzConfigProvider } from '@config/authz/authz.provider'

@Injectable()
export class AuthzClientProvider {
  private readonly logger = new Logger(AuthzClientProvider.name)
  private readonly mgmtClient: ManagementClient
  private readonly authClient: AuthenticationClient
  private get defaultNewUserRole() {
    return 'Team Member'
  }

  constructor(private readonly config: AuthzConfigProvider) {
    this.authClient = new AuthenticationClient({
      domain: this.config.domain,
      clientId: this.config.credentials.clientID,
    })

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

      const user = await this.mgmtClient.createUser(data)

      const availableRoles = await this.mgmtClient.getRoles()
      const role = availableRoles.find((r) => r.name === this.defaultNewUserRole)

      await this.mgmtClient.assignRolestoUser({ id: user.user_id }, { roles: [role.id] })

      return user
    } catch (error: unknown) {
      this.logger.error(error)
      throw error
    }
  }

  public async inviteUser(email: string): Promise<void> {
    try {
      this.logger.debug(`Inviting user with e-mail ${email}`)
      await this.authClient.requestChangePasswordEmail({ email, connection: this.connection })
    } catch (error: unknown) {
      this.logger.error(error)
      throw error
    }
  }

  public async updateUserMetadata(userID: string, key: string, value: string): Promise<void> {
    await this.mgmtClient.updateUserMetadata(
      { id: userID },
      {
        [key]: value,
      },
    )
  }
}
