import { Injectable } from '@nestjs/common'
import DomainTeamService from './team/service'
import DomainUserService from './user/service'

@Injectable()
class DomainService {
  constructor(public team: DomainTeamService, public user: DomainUserService) {}
}

export default DomainService
