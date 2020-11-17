import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { passportJwtSecret } from 'jwks-rsa'
import { ExtractJwt, Strategy } from 'passport-jwt'

@Injectable()
class AuthzService extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(AuthzService.name)

  constructor(private readonly configService: ConfigService) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        jwksUri: `${configService.get<string>('authz.issuer')}.well-known/jwks.json`,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: configService.get<string>('authz.audience'),
      issuer: configService.get<string>('authz.issuer'),
      algorithms: ['RS256'],
    })
  }

  validate(token: unknown): unknown {
    this.logger.debug({ message: 'Received request to guarded endpoint with token', token })
    return token
  }
}

export default AuthzService
