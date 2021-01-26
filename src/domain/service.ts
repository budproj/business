import { Injectable } from '@nestjs/common'

import DomainCycleService from './cycle/service'
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
  ) {}
}

export default DomainService
