import { ApolloError } from 'apollo-server-errors'
import { GRAPHQL_ERROR_CODES } from '../constants/errors.js'

export class SomethingWentWrongError extends ApolloError {
  constructor(message = GRAPHQL_ERROR_CODES.somethingWentWrong) {
    super(message, GRAPHQL_ERROR_CODES.somethingWentWrong)

    Object.defineProperties(this, {
      name: { value: 'SomethingWentWrongError' },
    })
  }
}
