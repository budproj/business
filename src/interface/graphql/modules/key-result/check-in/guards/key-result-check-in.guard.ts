import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'

@Injectable()
export class KeyResultCheckInGraphQLGuard implements CanActivate {
  public canActivate(executionContext: ExecutionContext): boolean {
    return false
  }
}
