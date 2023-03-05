import path from 'path'
import fs from 'fs'
import { globSync } from 'glob'
import { DateTimeResolver } from 'graphql-scalars'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { mergeTypeDefs } from '@graphql-tools/merge'

// resolvers
import * as authQueries from '../modules/user/resolvers/queries.js'
import * as authMutations from '../modules/user/resolvers/mutations.js'
import * as workspaceQueries from '../modules/workspace/resolvers/queries.js'
import * as workspaceMutations from '../modules/workspace/resolvers/mutations.js'

const graphqlFilenames = globSync('*/modules/**/*.graphql')

const typeDefsData = []

for (const graphqlFilename of graphqlFilenames) {
  const typeDef = fs.readFileSync(`${path.resolve()}/${graphqlFilename}`, {
    encoding: 'utf8',
  })

  typeDefsData.push(typeDef)
}

export const resolvers = {
  Query: {
    ...authQueries,
    ...workspaceQueries,
  },
  Mutation: {
    ...authMutations,
    ...workspaceMutations,
  },
  DateTime: DateTimeResolver,
}

export const typeDefs = mergeTypeDefs(typeDefsData)

export const schema = makeExecutableSchema({ resolvers, typeDefs })
