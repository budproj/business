import { registerAs } from '@nestjs/config'

import { AmplitudeConfigInterface } from './amplitude.interface'

export const amplitudeConfig = registerAs(
  'amplitude',
  (): AmplitudeConfigInterface => ({
    devSecretKey: process.env.AMPLITUDE_DEV_SECRET_KEY,
    prodSecretKey: process.env.AMPLITUDE_PROD_SECRET_KEY,
    userProfileUrl: process.env.AMPLITUDE_USER_PROFILE_URL,
    nodeEnv: process.env.NODE_ENV,
  }),
)
