import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { passportJwtSecret } from 'jwks-rsa'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { AuthzConfigInterface } from '@config/authz/authz.interface'

@Injectable()
export class AuthzStrategyProvider extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(AuthzStrategyProvider.name)

  constructor(protected readonly authzConfigService: ConfigService<AuthzConfigInterface>) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        jwksUri: `${authzConfigService.get<string>('issuer')}.well-known/jwks.json`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: authzConfigService.get<string>('audience'),
      issuer: authzConfigService.get<string>('issuer'),
      algorithms: ['RS256'],
    })
  }

  protected validate(token: any) {
    this.logger.debug({ message: 'Received request to guarded endpoint with token', token })

    return { token }
  }
}
