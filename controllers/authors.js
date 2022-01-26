const router = require('express').Router()
const { Blog } = require('../models')
const { sequelize } = require('../util/db')

router.get('/', async (req, res) => {

  const authors = await Blog
    .findAll({
      attributes: [
        'author',
        [sequelize.fn('COUNT', sequelize.col('blog.id')), 'blogs'],
        [sequelize.fn('SUM', sequelize.col('blog.likes')), 'likes']
      ],
      group: 'author',
      order: sequelize.literal('SUM(likes) DESC')
    })
    .catch(e => console.log(e))
  res.json(authors)
})

module.exports = router