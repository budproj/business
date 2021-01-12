import * as fs from 'fs'

import { ManagementClient, User } from 'auth0'
import * as csv from 'fast-csv'
import { randomPassword } from 'secure-random-password'

interface Auth0Interface {
  domain: string
}

interface AuthzUserDraft {
  name: string
  email: string
  role: UserRoleName
}

type UserRoleName = 'Stakeholder' | 'Squad Member' | 'Leader' | 'Team Member'

class Auth0 implements Auth0Interface {
  public domain = 'getbud.us.auth0.com'
  private readonly mgmtClient: ManagementClient

  constructor(token: string) {
    this.mgmtClient = new ManagementClient({
      token,
      domain: this.domain,
    })
  }

  inviteUsersFromFile(filePath: string) {
    fs.createReadStream(filePath)
      .pipe(csv.parse({ headers: true }))
      .on('error', (error) => console.error(error))
      .on('data', async (user) => this.inviteUser(user))
  }

  async inviteUser(userDraft: AuthzUserDraft) {
    const createdUser = await this.createUser(userDraft)

    await this.addDraftRoleToInvitedUser(createdUser, userDraft.role)
    await this.triggerInviteEmail(createdUser)
  }

  async createUser(userDraft: AuthzUserDraft) {
    const userToCreate = {
      name: userDraft.name,
      email: userDraft.email,
      password: randomPassword(),
      connection: 'Username-Password-Authentication',
    }

    const createdUser = await this.mgmtClient.createUser(userToCreate)
    console.log('Created user:')
    console.log(createdUser)

    return createdUser
  }

  async addDraftRoleToInvitedUser(user: User, roleName: UserRoleName) {
    const roles = await this.mgmtClient.getRoles()
    const userRoles = roles.filter((role) => role.name === roleName)

    const parameters = {
      id: user.user_id,
    }
    const userRolesData = {
      roles: userRoles.map((role) => role.id),
    }

    await this.mgmtClient.assignRolestoUser(parameters, userRolesData)
    console.log('Roles assigned to user:')
    console.log(userRoles)
  }

  async triggerInviteEmail(user: User) {
    const parameters = {
      user_id: user.user_id,
      result_url: 'https://app.getbud.co',
    }

    const createdTicket = await this.mgmtClient.createPasswordChangeTicket(parameters)
    console.log(`Created password reset ticket for user ${user.name}:`)
    console.log(createdTicket)
  }
}

export default Auth0
