import { registerAs } from '@nestjs/config'

import { AmplitudeConfigInterface } from './amplitude.interface'

export const amplitudeConfig = registerAs(
  'amplitude',
  (): AmplitudeConfigInterface => ({
    userProfileUrl: process.env.AMPLITUDE_USER_PROFILE_URL,
    amplitudeSecretKey: process.env.AMPLITUDE_SECRET_KEY,
  }),
)
