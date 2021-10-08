import { Exception } from '@core/common/exceptions/base.exception'

export class InvalidSessionIDException extends Exception {
  public get name(): string {
    return 'InvalidSessionID'
  }

  constructor(sessionID: string) {
    super(
      `You provided the Session-ID "${sessionID}". That value is not valid. A Session-ID must be composed only by numbers`,
    )
  }
}
