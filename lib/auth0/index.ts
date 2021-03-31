import { ManagementClient, AuthenticationClient, User, CreateUserData } from 'auth0'
import { randomPassword } from 'secure-random-password'

import { USER_GENDER } from 'src/domain/user/constants'

interface Auth0Interface {
  domain: string
}

interface UserDraft {
  first_name: string
  last_name: string
  email: string
  company_role: string
  picture: string
  gender: USER_GENDER
  authz_role: AuthzRoleName
  team: string
}

type AuthzRoleName = 'Squad Member' | 'Leader' | 'Team Member'

const { AUTH0_ISSUER } = process.env

class Auth0 implements Auth0Interface {
  public domain = AUTH0_ISSUER
  private readonly mgmtClient: ManagementClient
  private readonly authClient: AuthenticationClient

  constructor(token: string) {
    this.mgmtClient = new ManagementClient({
      token,
      domain: this.domain,
    })

    this.authClient = new AuthenticationClient({
      domain: this.domain,
    })
  }

  buildUserFullName(userDraft: UserDraft) {
    return `${userDraft.first_name} ${userDraft.last_name}`
  }

  async createUser(userDraft: UserDraft) {
    const userFullName = this.buildUserFullName(userDraft)
    const userToCreate: CreateUserData = {
      name: userFullName,
      email: userDraft.email,
      picture: userDraft.picture,
      password: randomPassword(),
      connection: 'Username-Password-Authentication',
    }

    const createdUser = await this.mgmtClient.createUser(userToCreate)

    return createdUser
  }

  async addDraftRoleToInvitedUser(user: User, roleName: AuthzRoleName) {
    const roles = await this.mgmtClient.getRoles()
    const userRoles = roles.filter((role) => role.name === roleName)

    const parameters = {
      id: user.user_id,
    }
    const userRolesData = {
      roles: userRoles.map((role) => role.id),
    }

    await this.mgmtClient.assignRolestoUser(parameters, userRolesData)

    return userRoles
  }

  async triggerInviteEmail(user: User) {
    const parameters = {
      email: user.email,
      connection: 'Username-Password-Authentication',
    }

    return this.authClient.requestChangePasswordEmail(parameters)
  }

  async getUserByEmail(email: string) {
    const user = await this.mgmtClient.getUsersByEmail(email)

    return user
  }
}

export default Auth0
