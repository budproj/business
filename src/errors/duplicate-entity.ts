import RailwayError from 'errors/railway-error'

class DuplicateEntityError extends RailwayError {
  public static get code() {
    return 'BUD001'
  }

  constructor(message: string) {
    super(message, DuplicateEntityError.code)
    Error.captureStackTrace(this, DuplicateEntityError)
  }
}

export default DuplicateEntityError
