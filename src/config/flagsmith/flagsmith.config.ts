import { registerAs } from '@nestjs/config'

import { FlagsmithConfigInterface } from './flagsmith.interface'

export const flagsmithConfig = registerAs(
  'flagsmith',
  (): FlagsmithConfigInterface => ({
    environmentKey: process.env.FLAGSMITH_SERVER_ENVIRONMENT_KEY,
  }),
)
