import { Injectable, Logger } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { passportJwtSecret } from 'jwks-rsa'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { AuthzConfigProvider } from '@config/authz/authz.provider'

@Injectable()
export class AuthzStrategyProvider extends PassportStrategy(Strategy) {
  constructor(protected readonly config: AuthzConfigProvider) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        jwksUri: `${config.issuer}.well-known/jwks.json`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: config.audience,
      issuer: config.issuer,
      algorithms: ['RS256'],
    })
  }

  protected validate(token: any) {
    return { token }
  }
}
