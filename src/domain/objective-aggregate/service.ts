import { Injectable } from '@nestjs/common'

@Injectable()
class ObjectiveAggregateService {
  getKeyResultsForTeams(teams: string[]): string {
    console.log(teams)
    return 'test'
  }
}

export default ObjectiveAggregateService
