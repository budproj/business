import { SetMetadata } from '@nestjs/common'

import { ActivityConstructor } from '@adapters/activity/types/activity-constructor.type'

export const AttachActivity = <D>(activity: ActivityConstructor<D>) =>
  SetMetadata('activity', activity)
