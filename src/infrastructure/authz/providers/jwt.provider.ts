import { promisify } from 'node:util'

import { Injectable } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'
import * as jwksClient from 'jwks-rsa'

import { AuthzConfigProvider } from '@config/authz/authz.provider'
import { Stopwatch } from "@lib/logger/pino.decorator";

@Injectable()
export class AuthJwtProvider {
  client: jwksClient.JwksClient

  constructor(protected readonly config: AuthzConfigProvider) {
    this.client = jwksClient({
      jwksUri: `${config.issuer}.well-known/jwks.json`,
    })
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  private readonly promisifiedVerify = promisify<
    string,
    jwt.Secret | jwt.GetPublicKeyOrSecret,
    jwt.VerifyOptions,
    jwt.JwtPayload
  >(jwt.verify)

  public getKey = (header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) => {
    this.client.getSigningKey(header.kid, function (_, key) {
      // eslint-disable-next-line unicorn/no-null
      if (!key?.getPublicKey) return callback(new Error('Invalid token'), null)

      const signingKey = key.getPublicKey()
      // eslint-disable-next-line unicorn/no-null
      callback(null, signingKey)
    })
  }

  @Stopwatch()
  public async verifyToken(token: string): Promise<jwt.JwtPayload> {
    const decodedToken = await this.promisifiedVerify(token, this.getKey, {
      algorithms: ['RS256'],
    })

    return decodedToken
  }
}
