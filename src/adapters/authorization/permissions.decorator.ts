import { SetMetadata } from '@nestjs/common'

import { Permission } from './permission.interface'

export const Permissions = (...permissions: Permission[]) => SetMetadata('permissions', permissions)
