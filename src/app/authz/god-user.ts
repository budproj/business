import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { CONSTRAINT } from 'src/domain/constants'

import { ACTION, PERMISSION, RESOURCE } from './constants'
import { AuthzUser } from './types'

@Injectable()
class AuthzGodUser implements AuthzUser {
  public readonly id: AuthzUser['id']
  public readonly firstName: AuthzUser['firstName']
  public readonly authzSub: AuthzUser['authzSub']
  public readonly role: AuthzUser['role']
  public readonly picture: AuthzUser['picture']
  public readonly createdAt: AuthzUser['createdAt']
  public readonly updatedAt: AuthzUser['updatedAt']
  public readonly token: AuthzUser['token']
  public readonly teams: AuthzUser['teams']
  public readonly scopes: AuthzUser['scopes']

  constructor(private readonly configService: ConfigService) {
    this.id = this.configService.get('godMode.userID')
    this.firstName = 'GOD'
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
      [RESOURCE.USER]: {
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

      [RESOURCE.KEY_RESULT]: {
        [ACTION.CREATE]: CONSTRAINT.ANY,
        [ACTION.READ]: CONSTRAINT.COMPANY,
        [ACTION.UPDATE]: CONSTRAINT.ANY,
        [ACTION.DELETE]: CONSTRAINT.ANY,
      },
    }
  }
}

export default AuthzGodUser
