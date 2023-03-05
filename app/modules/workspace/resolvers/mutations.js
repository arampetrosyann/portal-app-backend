import { validateData } from '../validation.js'
import {
  addWorkspace,
  saveWorkspace,
  removeWorkspace,
  getWorkspaceById,
} from '../common.js'
import { InvalidDataError } from '../../../errors/InvalidDataError.js'

export const createWorkspace = async (_parent, args, context) => {
  const { user } = context

  const { data: { data } = {}, error } = await validateData(args, context)
  if (error) throw new InvalidDataError()

  const workspace = await addWorkspace({ ...data, userId: user.id })

  return workspace
}

export const updateWorkspace = async (_parent, args, context) => {
  const { user } = context

  const { data: { id, data } = {}, error } = await validateData(args, context)
  if (error) throw new InvalidDataError()

  const existingWorkspace = await getWorkspaceById(id)

  if (!existingWorkspace) throw new InvalidDataError()

  if (existingWorkspace.getDataValue('userId') !== user.id) {
    throw new InvalidDataError()
  }

  const workspace = await saveWorkspace(id, data)

  return workspace
}

export const deleteWorkspace = async (_parent, args, context) => {
  const { user } = context

  const { data: { id } = {}, error } = await validateData(args, context)
  if (error) throw new InvalidDataError()

  const existingWorkspace = await getWorkspaceById(id)

  if (!existingWorkspace) throw new InvalidDataError()

  if (existingWorkspace.getDataValue('userId') !== user.id) {
    throw new InvalidDataError()
  }

  const isDeleted = await removeWorkspace(id)

  return !!isDeleted
}
