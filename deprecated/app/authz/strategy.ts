import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { passportJwtSecret } from 'jwks-rsa'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { AuthzToken, AuthzUser } from 'src/app/authz/types'

@Injectable()
class AuthzStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(AuthzStrategy.name)

  constructor(protected readonly configService: ConfigService) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        jwksUri: `https://${configService.get<string>('authz.issuer')}/.well-known/jwks.json`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: configService.get<string>('authz.audience'),
      issuer: `https://${configService.get<string>('authz.issuer')}/`,
      algorithms: ['RS256'],
    })
  }

  protected validate(token: AuthzToken): Partial<AuthzUser> {
    this.logger.debug({ message: 'Received request to guarded endpoint with token', token })
    return { token }
  }
}

export default AuthzStrategy
