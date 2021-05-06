import { validate as validateUUID } from 'uuid'

import { InvalidDeviceIDException } from '@adapters/exceptions/invalid-device-id.exception'
import { InvalidSessionIDException } from '@adapters/exceptions/invalid-session-id.exception'

import { TracingInterface } from './tracing.interface'
import { HttpRequestProperties } from './types/http-request-properties.type'
import { MarshalFunction } from './types/marshal-function.type'
import { Origin } from './types/origin.type'
import { Properties } from './types/properties.type'

export class TracingProvider {
  public data: TracingInterface
  private readonly marshal: MarshalFunction

  constructor(
    origin: Origin,
    properties?: Properties,
    marshalers?: Record<Origin, MarshalFunction>,
  ) {
    marshalers ??= {
      'http-request': this.marshalFromHTTPRequest,
    }

    this.marshal = marshalers[origin]
    this.data = this.marshal(properties)
  }

  public refreshData(properties?: Properties): void {
    this.data = this.marshal(properties)
  }

  private marshalFromHTTPRequest(properties?: HttpRequestProperties): TracingInterface {
    return {
      sessionID: this.marshalSessionID(properties),
      deviceID: this.marshalDeviceID(properties),
    }
  }

  private marshalSessionID(properties?: HttpRequestProperties): number | undefined {
    if (!properties?.['session-id']) return
    const sessionID = Number.parseInt(properties?.['session-id'], 10)

    if (Number.isNaN(sessionID)) {
      throw new InvalidSessionIDException(properties?.['session-id'])
    }

    return sessionID
  }

  private marshalDeviceID(properties?: HttpRequestProperties): string | undefined {
    const deviceID = properties?.['device-id']
    if (!deviceID) return

    if (!validateUUID(deviceID)) {
      throw new InvalidDeviceIDException(deviceID)
    }

    return deviceID
  }
}
