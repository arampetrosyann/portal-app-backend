import { Sequelize } from 'sequelize'
import env from '../configs/env.js'
import { ENVS } from '../constants/common.js'

const sequelize = new Sequelize(
  env.MYSQLDB_DATABASE,
  env.MYSQLDB_USERNAME,
  env.MYSQLDB_USER_PASSWORD,
  {
    host: env.MYSQLDB_HOSTNAME,
    dialect: 'mysql',
    logging: env.NODE_ENV === ENVS.development && console.log,
  },
)

sequelize.authenticate().catch((error) => {
  console.error('Unable to connect to the database: ', error)
})

sequelize.sync().catch((error) => {
  console.error('Unable to sync database: ', error)
})

export default sequelize
