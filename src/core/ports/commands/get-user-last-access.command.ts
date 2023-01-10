import { UserInterface } from '@core/modules/user/user.interface'
import { UserAmplitudeDataProperties } from '@infrastructure/amplitude/types/user-profile.data'

import { Command } from './base.command'

export class GetUserAmplitudeData extends Command<any> {
  public async execute(
    userID: UserInterface['id'],
  ): Promise<UserAmplitudeDataProperties['userData']['amp_props']> {
    const userData = await this.core.user.amplitude.getUserProfileAmplitudeData(userID)
    return userData.userData.amp_props
  }
}
