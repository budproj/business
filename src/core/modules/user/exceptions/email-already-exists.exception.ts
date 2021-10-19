import { Exception } from '@core/common/exceptions/base.exception'

export class EmailAlreadyExistsException extends Exception {
  public get name(): string {
    return 'EmailAlreadyExists'
  }

  constructor(email: string) {
    super('The provided email already exists in our database', {
      email,
    })
  }
}
