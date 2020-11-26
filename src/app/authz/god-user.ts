import { AuthzUser } from 'app/authz/types'

class GodUser implements AuthzUser {
  public readonly id: AuthzUser['id']
  public readonly authzSub: AuthzUser['authzSub']
  public readonly role: AuthzUser['role']
  public readonly picture: AuthzUser['picture']
  public readonly createdAt: AuthzUser['createdAt']
  public readonly updatedAt: AuthzUser['updatedAt']
  public readonly token: AuthzUser['token']
  public readonly teams: AuthzUser['teams']

  constructor() {
    this.id = 9999999999
    this.authzSub = 'GOD'
    this.role = 'GOD'
    this.picture =
      'https://vignette.wikia.nocookie.net/rickemorty/images/d/dc/4469093-screen_shot_2015-03-25_at_5.13.24_pm_copy.jpg/revision/latest?cb=20170918192423&path-prefix=pt-br'
    this.createdAt = new Date('1970-01-01T00:00:00.000Z')
    this.updatedAt = new Date('1970-01-01T00:00:00.000Z')
    this.token = {
      iss: 'GOD',
      sub: 'GOD',
      aud: ['GOD'],
      iat: 99999999,
      exp: 99999999,
      azp: 'GOD',
      scope: 'GOD',
      permissions: ['ALL'],
    }
  }
}

export default GodUser
