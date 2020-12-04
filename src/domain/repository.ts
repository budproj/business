import { Repository } from 'typeorm'

import { Company, CompanyDTO } from './company'
import { Cycle, CycleDTO } from './cycle'
import { KeyResult, KeyResultDTO } from './key-result'
import { ConfidenceReport, ConfidenceReportDTO } from './key-result/report/confidence'
import { ProgressReport, ProgressReportDTO } from './key-result/report/progress'
import { Objective, ObjectiveDTO } from './objective'
import { Team, TeamDTO } from './team'
import { User, UserDTO } from './user'
import { KeyResultView, KeyResultViewDTO } from './user/view/key-result'

abstract class DomainRepository<
  E extends
    | User
    | KeyResultView
    | Team
    | Objective
    | KeyResult
    | ProgressReport
    | ConfidenceReport
    | Cycle
    | Company,
  D extends
    | UserDTO
    | KeyResultViewDTO
    | TeamDTO
    | ObjectiveDTO
    | KeyResultDTO
    | ProgressReportDTO
    | ConfidenceReportDTO
    | CycleDTO
    | CompanyDTO
> extends Repository<E> {
  public findByIDWithCompanyConstraint: (
    id: D['id'],
    userCompanies: Array<CompanyDTO['id']>,
  ) => Promise<E | null>

  public findByIDWithTeamConstraint: (
    id: D['id'],
    userTeams: Array<TeamDTO['id']>,
  ) => Promise<E | null>

  public findByIDWithOwnsConstraint: (id: D['id'], userID: UserDTO['id']) => Promise<E | null>
}

export default DomainRepository
