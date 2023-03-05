import { addUser, getUser } from '../common.js'
import { validateData } from '../validation.js'
import { InvalidDataError } from '../../../errors/InvalidDataError.js'
import { generateTokenData, getTokenPayload } from '../../../utils/token.js'
import env from '../../../configs/env.js'

export const signIn = async (_parent, args, context) => {
  const { authenticate } = context

  const { data: { data } = {}, error } = await validateData(args, context)
  if (error) throw new InvalidDataError()

  const { user } = await authenticate('graphql-local', data)

  if (!user) throw new InvalidDataError()

  const token = await generateTokenData({ userId: user.id, email: user.email })

  return { user, token }
}

export const signUp = async (_parent, args, context) => {
  const { data: { data } = {}, error } = await validateData(args, context)
  if (error) throw new InvalidDataError()

  const user = await addUser(data)

  const token = await generateTokenData({ userId: user.getDataValue('id') })

  return { user, token }
}

export const refreshToken = async (_parent, args, context) => {
  const { data: { refreshToken } = {}, error } = await validateData(
    args,
    context,
  )
  if (error) throw new InvalidDataError()

  const payload = getTokenPayload(refreshToken, env.REFRESH_TOKEN_SECRET)

  if (!payload) throw new InvalidDataError()

  const { email } = payload

  const user = await getUser({ where: { email } })

  if (!user) return null

  const token = await generateTokenData({ userId: user.getDataValue('id') })

  return token
}
