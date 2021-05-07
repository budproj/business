import { TracingInterface } from '../tracing.interface'

import { Properties } from './properties.type'

export type MarshalFunction = (properties?: Properties) => TracingInterface
