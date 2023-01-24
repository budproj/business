import { UserInterface } from '@core/modules/user/user.interface'

import { UserAmplitudeDataProperties } from '../types/user-profile.data'

export interface UserProfileAdapter {
  getUserProfileAmplitudeData(userId: UserInterface['id']): Promise<UserAmplitudeDataProperties>
}
