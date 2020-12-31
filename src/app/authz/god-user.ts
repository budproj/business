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
    this.id = '7755b577-99cc-4de7-b3a4-5f34e1ab780c' // Replace with your local desired user ID
    this.name = 'GOD'
    this.authzSub = 'GOD'
    this.role = 'GOD'
    this.picture =
      'https://static.wikia.nocookie.net/rickandmorty/images/a/a6/Rick_Sanchez.png/revision/latest/scale-to-width-down/310?cb=20160923150728'
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
