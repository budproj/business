import { Logger } from '@nestjs/common'

import { GodmodeProvider } from '../godmode.provider'

export interface GodmodeClassInterface {
  godmode: GodmodeProvider
  logger: Logger
}
