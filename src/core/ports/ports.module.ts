import { Module } from '@nestjs/common'

import { KeyResultModule } from '@core/modules/key-result/key-result.module'
import { TeamModule } from '@core/modules/team/team.module'
import { UserModule } from '@core/modules/user/user.module'

import { CreateCheckInPort } from './create-check-in.port'
import { GetKeyResultCompanyPort } from './get-key-result-company.port'
import { GetKeyResultFromCheckInPort } from './get-key-result-from-check-in.port'
import { GetKeyResultOwnerPort } from './get-key-result-owner.port'
import { GetKeyResultTeamTreePort } from './get-key-result-team-tree.port'
import { GetKeyResultPort } from './get-key-result.port'
import { GetTeamOwner } from './get-team-owner.port'
import { GetUserCompaniesPort } from './get-user-companies.port'
import { CorePortsProvider } from './ports.provider'

@Module({
  imports: [UserModule, KeyResultModule, TeamModule],
  providers: [
    CorePortsProvider,
    CreateCheckInPort,
    GetKeyResultOwnerPort,
    GetKeyResultPort,
    GetKeyResultFromCheckInPort,
    GetKeyResultTeamTreePort,
    GetTeamOwner,
    GetKeyResultCompanyPort,
    GetUserCompaniesPort,
  ],
  exports: [CorePortsProvider],
})
export class CorePortsModule {}
