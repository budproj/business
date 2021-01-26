import { Injectable } from '@nestjs/common'

import DomainCycleService from 'src/domain/cycle/service'

import DomainTeamService from './team/service'
import DomainUserService from './user/service'

@Injectable()
class DomainService {
  constructor(
    public team: DomainTeamService,
    public user: DomainUserService,
    public cycle: DomainCycleService,
  ) {}
}

export default DomainService
