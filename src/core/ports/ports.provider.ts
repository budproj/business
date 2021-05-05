import { Injectable } from '@nestjs/common'

import { CreateCheckInPort } from './create-check-in.port'
import { GetKeyResultCompanyPort } from './get-key-result-company.port'
import { GetKeyResultFromCheckInPort } from './get-key-result-from-check-in.port'
import { GetKeyResultOwnerPort } from './get-key-result-owner.port'
import { GetKeyResultTeamTreePort } from './get-key-result-team-tree.port'
import { GetKeyResultPort } from './get-key-result.port'
import { GetTeamOwner } from './get-team-owner.port'
import { GetUserCompaniesPort } from './get-user-companies.port'

@Injectable()
export class CorePortsProvider {
  constructor(
    public readonly createCheckIn: CreateCheckInPort,
    public readonly getKeyResultOwner: GetKeyResultOwnerPort,
    public readonly getKeyResult: GetKeyResultPort,
    public readonly getKeyResultFromCheckIn: GetKeyResultFromCheckInPort,
    public readonly getKeyResulTeamTree: GetKeyResultTeamTreePort,
    public readonly getTeamOwner: GetTeamOwner,
    public readonly getKeyResultCompany: GetKeyResultCompanyPort,
    public readonly getUserCompanies: GetUserCompaniesPort,
  ) {}
}
