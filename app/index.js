import express from 'express'
import cors from 'cors'
import { ApolloServer, ApolloError } from 'apollo-server-express'
import passport from 'passport'
import passportJWT from 'passport-jwt'
import {
  GraphQLLocalStrategy,
  buildContext as getPassportGqlContext,
} from 'graphql-passport'
import env from './configs/env.js'
import { getUser, getUserById } from './modules/user/common.js'
import { compareHash } from './utils/common.js'
import { resolvers, typeDefs, schema } from './core/schema.js'
import permissions from './core/permissions.js'
import { GRAPHQL_ERROR_CODES } from './constants/errors.js'
import { SomethingWentWrongError } from './errors/SomethingWentWrongError.js'
import { AuthError } from './errors/AuthError.js'
import { ENVS } from './constants/common.js'

const app = express()

app.use(express.json())
app.use(cors({ credentials: true }))

const { ExtractJwt, Strategy: JWTStrategy } = passportJWT

passport.use(
  new GraphQLLocalStrategy(async (email, password, cb) => {
    const user = await getUser({ where: { email } })

    if (!user) return cb(null, false)

    const userData = user.get()

    const isValid = await compareHash(password, userData.password)

    if (!isValid) return cb(null, false)

    return cb(null, userData)
  }),
)

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.ACCESS_TOKEN_SECRET,
    },
    async (jwtPayload, cb) => {
      const user = await getUserById(jwtPayload.userId)

      if (!user) return cb(null, false)

      const userData = user.get()

      return cb(null, userData)
    },
  ),
)

app.use(passport.initialize())

const apolloServer = new ApolloServer({
  introspection: true,
  resolvers,
  schema,
  typeDefs,
  context: async ({ req, res }) => {
    try {
      const { operationName } = req.body

      if (operationName === 'IntrospectionQuery') {
        return { operationName }
      }

      const passportGqlContext = getPassportGqlContext({ req, res })

      const { unauthenticated } = permissions[operationName] || {}

      if (unauthenticated) return { ...passportGqlContext, operationName }

      const { user } = await passportGqlContext.authenticate('jwt', {
        session: false,
      })

      if (!user) throw new AuthError()

      return { ...passportGqlContext, user, operationName }
    } catch (error) {
      return { contextError: error }
    }
  },
  formatError: (err) => {
    if (env.NODE_ENV === ENVS.development) return err

    if (
      err.originalError instanceof ApolloError &&
      Object.values(GRAPHQL_ERROR_CODES).includes(err.extensions.code)
    ) {
      return err
    }

    return new SomethingWentWrongError()
  },
  formatResponse: (res, reqCtx) => {
    const { contextError } = reqCtx.context

    if (contextError) {
      const {
        message = '',
        extensions = {},
        path = [],
        locations = [],
      } = contextError
      return { data: null, errors: [{ message, locations, path, extensions }] }
    }

    return null
  },
})

await apolloServer.start()

app.use(apolloServer.getMiddleware({ path: '/graphql' }))

app.listen(env.PORT, async () => {
  console.log(`Listening on port ${env.PORT}`)
})
