import { UserDTO } from 'domain/user-aggregate/user/dto'

import RailwayError from './railway-error'

class ResourceNotAllowed extends RailwayError {
  public static get code() {
    return 'BUD001'
  }

  constructor(resource: string, userID: UserDTO['id']) {
    super(`User ${userID} is not allowed to access resource ${resource}`, ResourceNotAllowed.code)
  }
}

export default ResourceNotAllowed
