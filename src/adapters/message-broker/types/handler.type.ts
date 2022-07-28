import { MessageData } from './message-data.type'
import { MessageException } from './message-exception.type'

export type Handler = (exception: MessageException, data: MessageData) => void | Promise<void>
