import { CoreEntityInterface } from '@core/core-entity.interface'
import { Key } from '@core/modules/user/setting/user-setting.enums'

export interface UserSettingInterface extends CoreEntityInterface {
  id: string
  key: Key
  value: string
  userId: string
  updatedAt: Date
  preferences: any
}
