require('dotenv').config()

const PORT = process.env.PORT|| 3001
const SALTROUNDS = parseInt(process.env.SALTROUNDS)
const SECRET = process.env.SECRET

const DATABASE_URL = process.env.NODE_ENV === 'test'
  ? process.env.TEST_DATABASE_URL
  : process.env.DATABASE_URL

module.exports = {
  DATABASE_URL,
  PORT,
  SALTROUNDS,
  SECRET
}
