const router = require('express').Router()
const { tokenExtractor } = require('../util/middleware')
const { ReadingList } = require('../models')

router.post('/', tokenExtractor, async (req, res) => {
  try {
    const list = await ReadingList.create({ blogId: req.body.blogId, userId: req.decodedToken.id })
    res.json(list)
  } catch(error) {
    throw Error('ValidationError'+ error)
  }
})

router.put('/:id', tokenExtractor, async (req, res) => {

  const item = await ReadingList.findByPk(req.params.id)
  console.log(item.toJSON())
  if (item) {
    if (item.userId !== req.decodedToken.id) throw Error('CastError')
    item.read = 'true'
    const newItem =  await item.save()
    res.json(newItem)
  } else {
    res.status(404).end()
  }
})

module.exports = router