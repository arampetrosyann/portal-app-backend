import { ApolloError } from 'apollo-server-express'
import {
  GRAPHQL_ERROR_CODES,
  GRAPHQL_ERROR_MESSAGES,
} from '../constants/errors.js'

export class AuthError extends ApolloError {
  constructor(message = GRAPHQL_ERROR_MESSAGES.auth) {
    super(message, GRAPHQL_ERROR_CODES.auth)

    Object.defineProperties(this, {
      name: { value: 'AuthError' },
    })
  }
}
