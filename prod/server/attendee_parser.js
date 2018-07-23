const os = require('os')
const fs = require('fs')
const path = require('path')
const gcs = require('@google-cloud/storage')()
const xlsx = require('xlsx')
const admin = require('./firebase-admin-init')

function guessOffset(row) {
  console.log('guessOffset', row)
  let reEmail = /email|이메일/gi
  let reName = /name|이름|성함|참가자/gi
  let ix = {}, c = null, i = 0
  for (; i < row.length; i++) {
    c = row[i]
    if (reEmail.test(c)) {
      ix['email'] = i
    }
    if (reName.test(c)) {
      ix['name'] = i
    }
  }
  return ix
}

module.exports = function(event) {
  let re = /^meetup\/[a-zA-Z0-9]+\/attendee\/.*\.xlsx/gi
  if (!re.test(event.name)) {
    return Promise.resolve()
  }
  
  const bucket = gcs.bucket(event.bucket)
  const tempFilePath = path.join(os.tmpdir(), path.basename(event.name))
  
  return bucket.file(event.name).download({
    destination: tempFilePath,
  }).then(() => {
    console.log('reading ' + tempFilePath)
    let workbook = xlsx.readFile(tempFilePath)
    let sheet = workbook.Sheets[workbook.SheetNames[0]] // first sheet
    let lines = xlsx.utils.sheet_to_json(sheet, {header: 1})
    let header = lines.shift()
    let ix = guessOffset(header)
    // 'meetup/CRPeWqTk39u6kCrGdPsd/attendee/attendee_sample.xlsx'
    let id = event.name.split('/')[1]
    let collection = admin.firestore().doc('meetup/' + id).collection('attendee')
    let jobs = []
    // TODO: prevent duplicated email
    for (let row of lines) {
      if (!row.length) continue
      let doc = {
        name: row[ix.name],
        email: row[ix.email],
        staff: false,
        speaker: false,
        attend: false
      }
      jobs.push(collection.add(doc))
    }
    return Promise.all(jobs)
  }).then(() => {
    fs.unlinkSync(tempFilePath)
    return bucket.file(event.name).delete()
  }).catch(e => {
    console.log(e)
  })
}