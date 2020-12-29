import { ACTION, PERMISSION, RESOURCE } from 'app/authz/constants'
import { AuthzUser } from 'app/authz/types'
import { CONSTRAINT } from 'domain/constants'

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
    this.id = '00425f38-6b03-4fdb-960a-20349116d714' // Replace with your local desired user ID
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
        [ACTION.CREATE]: CONSTRAINT.ANY,
        [ACTION.READ]: CONSTRAINT.ANY,
        [ACTION.UPDATE]: CONSTRAINT.ANY,
        [ACTION.DELETE]: CONSTRAINT.ANY,
      },
      [RESOURCE.PROGRESS_REPORT]: {
        [ACTION.CREATE]: CONSTRAINT.ANY,
        [ACTION.READ]: CONSTRAINT.ANY,
        [ACTION.UPDATE]: CONSTRAINT.ANY,
        [ACTION.DELETE]: CONSTRAINT.ANY,
      },
      [RESOURCE.CONFIDENCE_REPORT]: {
        [ACTION.CREATE]: CONSTRAINT.ANY,
        [ACTION.READ]: CONSTRAINT.ANY,
        [ACTION.UPDATE]: CONSTRAINT.ANY,
        [ACTION.DELETE]: CONSTRAINT.ANY,
      },
      [RESOURCE.COMPANY]: {
        [ACTION.CREATE]: CONSTRAINT.ANY,
        [ACTION.READ]: CONSTRAINT.ANY,
        [ACTION.UPDATE]: CONSTRAINT.ANY,
        [ACTION.DELETE]: CONSTRAINT.ANY,
      },
      [RESOURCE.CYCLE]: {
        [ACTION.CREATE]: CONSTRAINT.ANY,
        [ACTION.READ]: CONSTRAINT.COMPANY,
        [ACTION.UPDATE]: CONSTRAINT.ANY,
        [ACTION.DELETE]: CONSTRAINT.ANY,
      },
      [RESOURCE.OBJECTIVE]: {
        [ACTION.CREATE]: CONSTRAINT.ANY,
        [ACTION.READ]: CONSTRAINT.ANY,
        [ACTION.UPDATE]: CONSTRAINT.ANY,
        [ACTION.DELETE]: CONSTRAINT.ANY,
      },
      [RESOURCE.TEAM]: {
        [ACTION.CREATE]: CONSTRAINT.ANY,
        [ACTION.READ]: CONSTRAINT.ANY,
        [ACTION.UPDATE]: CONSTRAINT.ANY,
        [ACTION.DELETE]: CONSTRAINT.ANY,
      },
      [RESOURCE.USER]: {
        [ACTION.CREATE]: CONSTRAINT.ANY,
        [ACTION.READ]: CONSTRAINT.ANY,
        [ACTION.UPDATE]: CONSTRAINT.ANY,
        [ACTION.DELETE]: CONSTRAINT.ANY,
      },
      [RESOURCE.KEY_RESULT_VIEW]: {
        [ACTION.CREATE]: CONSTRAINT.ANY,
        [ACTION.READ]: CONSTRAINT.COMPANY,
        [ACTION.UPDATE]: CONSTRAINT.ANY,
        [ACTION.DELETE]: CONSTRAINT.ANY,
      },
    }
  }
}

export default GodUser
