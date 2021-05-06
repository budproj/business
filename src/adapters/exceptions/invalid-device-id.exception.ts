import { Exception } from './base.exception'

export class InvalidDeviceIDException extends Exception {
  public get name(): string {
    return 'InvalidDeviceID'
  }

  constructor(deviceID: string) {
    super(
      `You provided the Device-ID "${deviceID}". That value is not valid. A Device-ID must be a valid UUID string`,
    )
  }
}
