const functions = require('firebase-functions')
const { Nuxt } = require('nuxt')
const express = require('express')
const Cookie = require('universal-cookie')
const app = express()
const admin = require('./firebase-admin-init')
const api = require('./api')
const attendeeParser = require('./attendee_parser')

const config = {
  dev: false,
  buildDir: 'nuxt',
  build: {
    publicPath: '/assets/'
  }
}
const nuxt = new Nuxt(config)

// inject universal firebase/auth user
app.use((req, res, next) => {
  let ivy = new Cookie(req.headers.cookie)
  let idToken = ivy.get('_sess')
  if (idToken) {
    admin.auth().verifyIdToken(idToken).then(user => {
      req.user = user
      next()
    }).catch(e => {
      next()
    })
  } else {
    next()
  }
})

// add api routes middleware
app.use('/api', api)

// add nuxt renderer middleware
app.use((req, res) => {
  res.set('Cache-Control', 'public, max-age=150, s-maxage=150')
  return new Promise((resolve, reject) => {
    nuxt.render(req, res, promise => {
      promise.then(resolve).catch(reject)
    })
  }).catch(e => {
    console.log(e)
  })
})

exports.attendeeParser = functions.storage.object().onFinalize(attendeeParser)

exports.nuxtssr = functions.https.onRequest(app)
