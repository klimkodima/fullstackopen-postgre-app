const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class Blog extends Model {}

Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  likes: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min:1991,
      greaterThanCurrent(value) {
        const current = new Date().getFullYear()
        if (parseInt(value) > current) {
          throw new Error(`year can not be greater than ${current}`)
        }
      }
    }
  }
}, {
  sequelize,
  underscored:true,
  timestamps:true,
  modelName:'blog'
})

module.exports = Blog