import { CycleDTO } from 'src/domain/cycle/dto'
import { TeamDTO } from 'src/domain/team/dto'

export interface KeyResultFilters {
  cycleID?: CycleDTO['id']
  teamIDs?: Array<TeamDTO['id']>
}
