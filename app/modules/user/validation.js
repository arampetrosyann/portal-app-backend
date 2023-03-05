import Joi from 'joi'

export const validateData = async (args = {}, context = {}) => {
  const { operationName = '' } = context

  const schema = Joi.object({
    signUp: Joi.object({
      data: Joi.object({
        fullName: Joi.string().min(6).max(60).required().trim(),
        email: Joi.string().email().max(255).required().trim(),
        password: Joi.string().min(6).max(20).required(),
      }).required(),
    }),
    signIn: Joi.object({
      data: Joi.object({
        email: Joi.string().email().max(255).required().trim(),
        password: Joi.string().min(6).max(20).required(),
      }).required(),
    }),
    refreshToken: Joi.object({
      refreshToken: Joi.string().required(),
    }),
  })

  try {
    const data = await schema.validateAsync(
      { [operationName]: args },
      { abortEarly: true },
    )
    return { data: data[operationName] }
  } catch (error) {
    return { error }
  }
}
