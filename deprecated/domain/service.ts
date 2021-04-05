import { Injectable } from '@nestjs/common'

import DomainCycleService from './cycle/service'
import DomainKeyResultService from './key-result/service'
import DomainObjectiveService from './objective/service'
import DomainTeamService from './team/service'
import DomainUserService from './user/service'

@Injectable()
class DomainService {
  constructor(
    public team: DomainTeamService,
    public user: DomainUserService,
    public cycle: DomainCycleService,
    public objective: DomainObjectiveService,
    public keyResult: DomainKeyResultService,
  ) {}
}

export default DomainService
