import { User } from '@core/modules/user/user.orm-entity'

export type Recipient = {
  id: User['id'] | User['authzSub']
  name?: string
}
