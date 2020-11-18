import { Injectable } from '@nestjs/common'

@Injectable()
class ObjectiveAggregateService {
  getKeyResultsOwnedBy(uid: string): string {
    return 'test'
  }
}

export default ObjectiveAggregateService
