import { User } from '@core/modules/user/user.orm-entity'

export type MessageBrokerRecipient = User['authzSub']
