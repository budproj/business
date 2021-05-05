interface SerializedException {
  name: string
  message: string
  stack?: string
  metadata?: Record<string, any>
}

export abstract class Exception extends Error {
  abstract name: string

  constructor(readonly message: string, readonly metadata?: Record<string, any>) {
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
