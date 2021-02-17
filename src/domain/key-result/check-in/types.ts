import { DOMAIN_QUERY_ORDER } from 'src/domain/constants'
import { CycleDTO } from 'src/domain/cycle/dto'
import { KeyResultCheckIn } from 'src/domain/key-result/check-in/entities'
import { UserDTO } from 'src/domain/user/dto'

export interface KeyResultCheckInFilters {
  userIDs?: Array<UserDTO['id']>
  cycleID?: CycleDTO['id']
}

export interface KeyResultCheckInQueryOptions {
  limit?: number
  orderBy?: Array<[keyof KeyResultCheckIn, DOMAIN_QUERY_ORDER]>
}
