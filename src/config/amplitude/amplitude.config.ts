import { registerAs } from '@nestjs/config'

import { AmplitudeConfigInterface } from './amplitude.interface'

export const amplitudeConfig = registerAs(
  'amplitude',
  (): AmplitudeConfigInterface => ({
    apiKey: process.env.AMPLITUDE_API_KEY,
  }),
)
