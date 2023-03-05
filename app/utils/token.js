import jwt from 'jsonwebtoken'
import env from '../configs/env.js'
import { TOKEN_TYPES } from '../constants/common.js'

export const signToken = async (data, secret, options) =>
  jwt.sign(data, secret, options)

export const decodeToken = (token) => jwt.decode(token)

export const getTokenPayload = (token, secret) => {
  try {
    return jwt.verify(token, secret)
  } catch {
    return null
  }
}

export const generateTokenData = async ({ userId, email }) => {
  const accessToken = await signToken(
    { userId, email },
    env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: env.ACCESS_TOKEN_EXPIRATION_TIME,
    },
  )
  const refreshToken = await signToken({ email }, env.REFRESH_TOKEN_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRATION_TIME,
  })

  return {
    accessToken,
    refreshToken,
    tokenType: TOKEN_TYPES.bearer,
  }
}
