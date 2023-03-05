import { DataTypes } from 'sequelize'
import sequelize from '../../services/sequelize.js'
import User from '../user/model.js'

const Workspace = sequelize.define(
  'Workspace',
  {
    name: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    subDomain: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'Workspaces',
    indexes: [
      {
        unique: true,
        fields: ['subDomain', 'userId'],
      },
    ],
  },
)

const options = {
  foreignKey: {
    allowNull: false,
    name: 'userId',
  },
  onDelete: 'CASCADE',
}

Workspace.belongsTo(User, options)
User.hasMany(Workspace, options)

export default Workspace
