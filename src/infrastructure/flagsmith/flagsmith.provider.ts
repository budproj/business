import { Injectable } from '@nestjs/common'
import Flagsmith, { Flags } from 'flagsmith-nodejs'

import { FlagsmithConfigProvider } from '@config/flagsmith/flagsmith.provider'

import { Traits } from './types/traits.data'

@Injectable()
export class FlagsmithProvider {
  flagsmith: Flagsmith

  constructor(protected readonly config: FlagsmithConfigProvider) {
    this.flagsmith = new Flagsmith(config)
  }

  /**
   *
   * @param userEmail an identifier for the user
   * @param traits a list of traits to be upserted in flagsmith servers
   */
  async upsertTraits(userEmail: string, traits: Traits): Promise<void> {
    await this.updateIdentity(userEmail, traits)
  }

  /**
   *
   * @param userEmail an identifier for the user
   * @param feature a string with the name of the feature flag to be checked
   * @returns a boolean value indicating if the feature flag is enabled or not for this user
   */
  async hasFeature(userEmail: string, feature: string): Promise<boolean> {
    const features = await this.updateIdentity(userEmail)

    return features.isFeatureEnabled(feature)
  }

  private async updateIdentity(userEmail: string, traits?: Traits): Promise<Flags> {
    return this.flagsmith.getIdentityFlags(userEmail, traits)
  }
}
