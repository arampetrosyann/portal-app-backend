import { InvalidDataError } from '../../../errors/InvalidDataError.js'
import { validateData } from '../validation.js'
import {
  getWorkspaceById,
  getWorkspaces,
  getWorkspaceSubDomainSuggestion,
} from '../common.js'

export const workspaceById = async (_parent, args, context) => {
  const { user } = context

  const { data: { id } = {}, error } = await validateData(args, context)
  if (error) throw new InvalidDataError()

  const workspace = await getWorkspaceById(id)

  if (workspace && workspace.getDataValue('userId') !== user.id) {
    throw new InvalidDataError()
  }

  return workspace
}

export const workspaces = async (_parent, args, context) => {
  const { user } = context

  const { error } = await validateData(args, context)
  if (error) throw new InvalidDataError()

  const { rows, count } = await getWorkspaces({
    where: {
      userId: user.id,
    },
  })

  return { data: rows, count }
}

export const workspaceSubDomainSuggestion = async (_parent, args, context) => {
  const { user } = context

  const { data: { subDomain } = {}, error } = await validateData(args, context)
  if (error) throw new InvalidDataError()

  const suggestion = await getWorkspaceSubDomainSuggestion(subDomain, user.id)

  return suggestion
}
