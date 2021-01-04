import { Injectable } from '@nestjs/common'

import IsACompany from './specifications/is-a-company'

@Injectable()
class DomainTeamSpecification {
  constructor(public readonly isACompany: IsACompany) {}
}

export default DomainTeamSpecification
