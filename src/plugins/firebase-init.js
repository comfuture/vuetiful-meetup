// XXX fix firebase bug -_-
if (process.server) {
  global.XMLHttpRequest = require('xhr2')
}
import Cookie from 'universal-cookie'
import firebase from '@firebase/app'
import '@firebase/auth'
import '@firebase/firestore'
import '@firebase/storage'

let config = {
  apiKey: "AIzaSyAnpvjBQXHY9Tuatuw1sVO6AgCg3-AVdgI",
  authDomain: "vuetiful-meetup.firebaseapp.com",
  databaseURL: "https://vuetiful-meetup.firebaseio.com",
  projectId: "vuetiful-meetup",
  storageBucket: "vuetiful-meetup.appspot.com",
  messagingSenderId: "613310856357"
}

if (!firebase.apps.length) {
  firebase.initializeApp(config)
  firebase.firestore()
  firebase.firestore().settings({
    timestampsInSnapshots: true
  })
  if (process.browser) {
    firebase.firestore().enablePersistence()
  }
}

export const db = firebase.firestore()

export const auth = firebase.auth()
auth.addAuthTokenListener(idToken => {
  let ivy = new Cookie()
  ivy.set('_sess', idToken, {path: '/'})
})

export const storage = firebase.storage()

export default firebase
