import Joi from 'joi'

export const validateData = async (args = {}, context = {}) => {
  const { operationName = '' } = context

  const schema = Joi.object({
    workspaceById: Joi.object({
      id: Joi.number().positive().integer().strict().required(),
    }),
    workspaces: Joi.object({}),
    workspaceSubDomainSuggestion: Joi.object({
      subDomain: Joi.string().required(),
    }),
    createWorkspace: Joi.object({
      data: Joi.object({
        name: Joi.string().max(60).required(),
        subDomain: Joi.string().max(255).required(),
      }).required(),
    }),
    updateWorkspace: Joi.object({
      id: Joi.number().positive().integer().strict().required(),
      data: Joi.object({
        name: Joi.string().max(60),
        subDomain: Joi.string().max(255),
      }).required(),
    }),
    deleteWorkspace: Joi.object({
      id: Joi.number().positive().integer().strict().required(),
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
