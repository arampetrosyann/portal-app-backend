import bcrypt from 'bcrypt'

export const generateHash = async (data, saltRounds = 10) => {
  return await bcrypt.hash(data, saltRounds)
}

export const compareHash = async (data, hash) => {
  return await bcrypt.compare(data, hash)
}

export const getRandomNumber = (min = 1, max = Number.MAX_SAFE_INTEGER) =>
  Math.floor(Math.random() * (max - min + 1)) + min
