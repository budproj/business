class RailwayError extends Error {
  public readonly code: string

  constructor(message: string, code: string) {
    super(message)
    Error.captureStackTrace(this, RailwayError)

    this.code = code
  }
}

export default RailwayError
