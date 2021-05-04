import { TracingInterface } from './tracing.interface'
import { HttpRequestProperties } from './types/http-request-properties.type'
import { Origin } from './types/origin.type'
import { Properties } from './types/properties.type'

export class TracingProvider {
  public data: TracingInterface
  private readonly dataMarshalers: Record<Origin, (data: Properties) => TracingInterface> = {
    'http-request': TracingProvider.marshalFromHTTPRequest,
  }

  constructor(origin: Origin, properties: Properties) {
    const marshal = this.dataMarshalers[origin]
    this.data = marshal(properties)
  }

  static marshalFromHTTPRequest(data: HttpRequestProperties): TracingInterface {
    return {
      sessionID: data['Session-Id'],
    }
  }
}
