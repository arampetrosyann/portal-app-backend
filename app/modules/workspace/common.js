import { QueryTypes } from 'sequelize'
import Workspace from './model.js'
import sequelize from '../../services/sequelize.js'
import { getRandomNumber } from '../../utils/common.js'

export const getWorkspaceById = async (id) => {
  const workspace = await Workspace.findByPk(id)

  return workspace
}

export const getWorkspaces = async (options) => {
  const workspaces = await Workspace.findAndCountAll(options)

  return workspaces
}

export const getWorkspaceSubDomainSuggestion = async (subDomain, userId) => {
  let index = 0
  let data = null
  let count = 0

  do {
    if (count === 22) break

    data = await sequelize.query(
      `
        SELECT freeSubDomain FROM (
          SELECT ${`"${subDomain}"`} AS freeSubDomain
          UNION SELECT ${`"${subDomain}${++index}"`} AS freeSubDomain
          UNION SELECT ${`"${subDomain}${++index}"`} AS freeSubDomain
          UNION SELECT ${`"${subDomain}${++index}"`} AS freeSubDomain
          UNION SELECT ${`"${subDomain}${++index}"`} AS freeSubDomain
          UNION SELECT ${`"${subDomain}${getRandomNumber(
            ++index,
          )}"`} AS freeSubDomain
          UNION SELECT ${`"${subDomain}${getRandomNumber(
            ++index,
          )}"`} AS freeSubDomain
        ) AS freeSubDomains
        WHERE freeSubDomain NOT IN (
          SELECT subDomain FROM Workspaces 
          WHERE subDomain LIKE "%${subDomain}%" AND Workspaces.userId=${userId}
          ) LIMIT 1;
    `,
      {
        type: QueryTypes.SELECT,
        raw: true,
        plain: true,
      },
    )

    count++
  } while (!data)

  const { freeSubDomain } = data

  return freeSubDomain !== subDomain ? freeSubDomain : null
}

export const addWorkspace = async (data) => {
  const workspace = await Workspace.create(data)

  return workspace
}

export const saveWorkspace = async (id, data) => {
  const workspace = await getWorkspaceById(id)

  if (!workspace) return null

  await workspace.update(data)

  return workspace
}

export const removeWorkspace = async (id) => {
  await Workspace.destroy({ where: { id } })

  return true
}
