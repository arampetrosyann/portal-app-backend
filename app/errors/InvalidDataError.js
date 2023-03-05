import { ApolloError } from 'apollo-server-errors'
import {
  GRAPHQL_ERROR_CODES,
  GRAPHQL_ERROR_MESSAGES,
} from '../constants/errors.js'

export class InvalidDataError extends ApolloError {
  constructor(message = GRAPHQL_ERROR_MESSAGES.invalidData) {
    super(message, GRAPHQL_ERROR_CODES.invalidData)

    Object.defineProperties(this, {
      name: { value: 'InvalidDataError' },
    })
  }
}
