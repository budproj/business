import * as jwt from 'jsonwebtoken'

import { Command } from './base.command'

export class VerifyToken extends Command<jwt.JwtPayload> {
  public async execute(token: string): Promise<jwt.JwtPayload> {
    return this.core.jwt.verifyToken(token)
  }
}
