import { TracingInterface } from './tracing.interface'
import { HttpRequestProperties } from './types/http-request-properties.type'
import { MarshalFunction } from './types/marshal-function.type'
import { Origin } from './types/origin.type'
import { Properties } from './types/properties.type'

export class TracingProvider {
  public data: TracingInterface
  private readonly marshal: MarshalFunction
  private readonly dataMarshalers: Record<Origin, MarshalFunction> = {
    'http-request': TracingProvider.marshalFromHTTPRequest,
  }

  constructor(origin: Origin, properties?: Properties) {
    this.marshal = this.dataMarshalers[origin]
    this.data = this.marshal(properties)
  }

  static marshalFromHTTPRequest(properties?: HttpRequestProperties): TracingInterface {
    return {
      sessionID: properties?.['session-id'],
    }
  }

  public refreshData(properties?: Properties): void {
    this.data = this.marshal(properties)
  }
}
