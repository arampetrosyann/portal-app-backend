import User from './model.js'
import { generateHash } from '../../utils/common.js'

export const getUserById = async (id) => {
  const user = await User.findByPk(id)

  return user
}

export const getUser = async (options) => {
  const user = await User.findOne(options)

  return user
}

export const addUser = async (data) => {
  const { password, ...restData } = data

  const hashedPassword = await generateHash(password)

  const user = await User.create({ ...restData, password: hashedPassword })

  return user
}
