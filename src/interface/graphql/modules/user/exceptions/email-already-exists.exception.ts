import { ApolloError } from 'apollo-server-errors'

export class EmailAlreadyExistsApolloError extends ApolloError {
  constructor(message: string) {
    super(message, 'EMAIL_ALREADY_EXISTS')

    Object.defineProperty(this, 'name', { value: 'EmailAlreadyExists' })
  }
}
