const router = require('express').Router()
const bcrypt = require('bcrypt')
const { User, Blog } = require('../models')
const { SALTROUNDS } = require('../util/config')

const userFinder = async (req, res, next) => {
  req.user = await User.findByPk(req.params.id)
  if (!req.user) throw Error('malformatted id')
  next()
}

router.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['password','createdAt','updatedAt'] },
    include: {
      model: Blog,
      attributes: ['id', 'text', 'url', 'likes']
    }
  })
  res.json(users)
})

router.post('/', async (req, res) => {
  try {
    if ( !req.body.password || req.body.password.length < 3) {
      return res.status(400).send({ error: 'Password validation failed: password: Path `password` (`as`) is shorter than the minimum allowed length (3).' })
    }
    req.body.password = await bcrypt.hash(req.body.password, SALTROUNDS)
    const user = await User.create(req.body)
    console.log(user)
    res.json(user)
  } catch(error) {
    return res.status(400).json({ error })
  }
})

router.get('/:id', async (req, res) => {
  let where = {}

  if (req.query.read === 'true') {
    where = { read: true }
  }

  if (req.query.read === 'false') {
    where = { read: false }
  }
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['id','createdAt', 'updatedAt', 'password'] } ,
    include:
    {
      model: Blog,
      as: 'readings',
      attributes: { exclude: ['blogId','userId', 'createdAt', 'updatedAt'] },
      through: {
        attributes: ['read', 'id'],
        as: 'readinglists',
        where
      }
    }
  })
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.put('/:username', async (req, res) => {
  req.user = await User.findOne({
    where: {
      username: req.params.username
    }
  })
  if (req.user) {
    const user =  await req.user.save()
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.delete('/:id', userFinder, async (req, res) => {
  if (req.user) {
    await req.user.destroy()
    res.status(204).end()
  } else {
    res.status(404).end()
  }
})

module.exports = router