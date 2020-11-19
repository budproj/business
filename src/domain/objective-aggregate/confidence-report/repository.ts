import { EntityRepository, Repository } from 'typeorm'

import { ConfidenceReport } from './entities'

@EntityRepository(ConfidenceReport)
class ConfidenceReportRepository extends Repository<ConfidenceReport> {}

export default ConfidenceReportRepository
