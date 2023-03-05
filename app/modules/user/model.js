import { DataTypes } from 'sequelize'
import sequelize from '../../services/sequelize.js'

const User = sequelize.define(
  'User',
  {
    fullName: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        len: [6, 60],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'Users',
  },
)

export default User
