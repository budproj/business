import { EntityRepository, Repository } from 'typeorm'

import { ProgressReport } from './entities'

@EntityRepository(ProgressReport)
class ProgressReportRepository extends Repository<ProgressReport> {}

export default ProgressReportRepository
