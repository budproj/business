import { Injectable } from '@nestjs/common'
import axios from 'axios'

import { AmplitudeConfigProvider } from '@config/amplitude/amplitude.provider'
import { UserInterface } from '@core/modules/user/user.interface'

import { UserProfileAdapter } from '../adapters/user-profil.adapter'
import { UserAmplitudeDataProperties } from '../types/user-profile.data'

@Injectable()
export class UserProfileProvider implements UserProfileAdapter {
  constructor(private readonly configService: AmplitudeConfigProvider) {}

  public async getUserProfileAmplitudeData(
    userId: UserInterface['id'],
  ): Promise<UserAmplitudeDataProperties> {
    const url = this.configService.userProfileUrl
    const { amplitudeSecretKey } = this.configService

    const { data } = await axios.get<UserAmplitudeDataProperties>(url, {
      params: { user_id: userId, get_amp_props: true },
      headers: { authorization: `Api-Key ${amplitudeSecretKey}` },
    })
    return data
  }
}
