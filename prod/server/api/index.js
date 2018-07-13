const { Router } = require('express')
const api = new Router()

api.get('/', (req, res, next) => {
  res.json({
    email: req.user.email
  })
})

module.exports = api