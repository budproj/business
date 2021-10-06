import { ObjectLiteral } from '../types/object-literal.type'

import { SerializedException } from './interfaces/serialized-exception.interface'

export abstract class Exception extends Error {
  abstract name: string

  constructor(readonly message: string, readonly metadata?: ObjectLiteral) {
    super(message)
    Error.captureStackTrace(this, this.constructor)
  }

  public toJSON(): SerializedException {
    return {
      name: this.name,
      message: this.message,
      stack: this.stack,
      metadata: this.metadata,
    }
  }
}
