const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./readinglist')
const Session = require('./session')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: ReadingList , as: 'readings' })
Blog.belongsToMany(User, { through: ReadingList, as: 'readings_users' })

User.hasOne(Session)


module.exports = {
  Blog, User, ReadingList, Session
}