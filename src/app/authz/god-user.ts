import { ACTION, PERMISSION, RESOURCE, SCOPE } from 'app/authz/constants'
import { AuthzUser } from 'app/authz/types'

class GodUser implements AuthzUser {
  public readonly id: AuthzUser['id']
  public readonly name: AuthzUser['name']
  public readonly authzSub: AuthzUser['authzSub']
  public readonly role: AuthzUser['role']
  public readonly picture: AuthzUser['picture']
  public readonly createdAt: AuthzUser['createdAt']
  public readonly updatedAt: AuthzUser['updatedAt']
  public readonly token: AuthzUser['token']
  public readonly teams: AuthzUser['teams']
  public readonly scopes: AuthzUser['scopes']

  constructor() {
    this.id = 1
    this.name = 'GOD'
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
      permissions: Object.values(PERMISSION),
    }
    this.scopes = {
      [RESOURCE.KEY_RESULT]: {
        [ACTION.CREATE]: SCOPE.ANY,
        [ACTION.READ]: SCOPE.ANY,
        [ACTION.UPDATE]: SCOPE.ANY,
        [ACTION.DELETE]: SCOPE.ANY,
      },
      [RESOURCE.PROGRESS_REPORT]: {
        [ACTION.CREATE]: SCOPE.ANY,
        [ACTION.READ]: SCOPE.ANY,
        [ACTION.UPDATE]: SCOPE.ANY,
        [ACTION.DELETE]: SCOPE.ANY,
      },
      [RESOURCE.CONFIDENCE_REPORT]: {
        [ACTION.CREATE]: SCOPE.ANY,
        [ACTION.READ]: SCOPE.ANY,
        [ACTION.UPDATE]: SCOPE.ANY,
        [ACTION.DELETE]: SCOPE.ANY,
      },
      [RESOURCE.COMPANY]: {
        [ACTION.CREATE]: SCOPE.ANY,
        [ACTION.READ]: SCOPE.ANY,
        [ACTION.UPDATE]: SCOPE.ANY,
        [ACTION.DELETE]: SCOPE.ANY,
      },
      [RESOURCE.CYCLE]: {
        [ACTION.CREATE]: SCOPE.ANY,
        [ACTION.READ]: SCOPE.ANY,
        [ACTION.UPDATE]: SCOPE.ANY,
        [ACTION.DELETE]: SCOPE.ANY,
      },
      [RESOURCE.OBJECTIVE]: {
        [ACTION.CREATE]: SCOPE.ANY,
        [ACTION.READ]: SCOPE.ANY,
        [ACTION.UPDATE]: SCOPE.ANY,
        [ACTION.DELETE]: SCOPE.ANY,
      },
      [RESOURCE.TEAM]: {
        [ACTION.CREATE]: SCOPE.ANY,
        [ACTION.READ]: SCOPE.ANY,
        [ACTION.UPDATE]: SCOPE.ANY,
        [ACTION.DELETE]: SCOPE.ANY,
      },
      [RESOURCE.USER]: {
        [ACTION.CREATE]: SCOPE.ANY,
        [ACTION.READ]: SCOPE.COMPANY,
        [ACTION.UPDATE]: SCOPE.ANY,
        [ACTION.DELETE]: SCOPE.ANY,
      },
      [RESOURCE.KEY_RESULT_VIEW]: {
        [ACTION.CREATE]: SCOPE.ANY,
        [ACTION.READ]: SCOPE.ANY,
        [ACTION.UPDATE]: SCOPE.ANY,
        [ACTION.DELETE]: SCOPE.ANY,
      },
    }
  }
}

export default GodUser
