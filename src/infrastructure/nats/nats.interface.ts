import { Msg, NatsError } from 'nats'

export type NatsHandler = (error: NatsError, message: Msg) => void | Promise<void>
