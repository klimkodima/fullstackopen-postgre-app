const router = require('express').Router()
const { tokenExtractor } = require('../util/middleware')
const { Blog, User } = require('../models')
const { Op } = require('sequelize')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  if (!req.blog) throw Error('malformatted id')
  next()
}

router.get('/', async (req, res) => {
  let where = {}

  if (req.query.search) {
    where = {
      [Op.or]: [
        {
          text: {
            [Op.substring]: req.query.search
          }
        },
        {
          url: {
            [Op.substring]: req.query.search
          }
        }
      ]
    }
  }
  const blogs = await Blog.findAll(
    {
      attributes: { exclude: ['user_id','created_at'] },
      include: {
        model: User,
        attributes: ['name']
      },
      order: [
        ['likes', 'DESC'],
      ],
      where
    }
  )
  res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({ ...req.body, userId: user.id })
    res.json(blog)
  } catch(error) {
    throw Error('ValidationError'+ error)
  }
})


router.get('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

router.put('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    req.blog.likes = req.body.likes
    try {
      const blog = await req.blog.save()
      res.json(blog)
    } catch(error) {
      throw Error('ValidationError')
    }
  } else {
    res.status(404).end()
  }
})

router.delete('/:id', tokenExtractor, blogFinder, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  if (req.blog && req.blog.userId === user.id) {
    await req.blog.destroy()
    res.status(204).end()
  } else {
    res.status(404).end()
  }
})


module.exports = router