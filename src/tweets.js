const { google } = require('googleapis')

const SPREADSHEET_ID = '1zH0oBaRmZxAJFtRnnMTTZk81kwTO_nTslLeVNDA8Ysw'

function getInsertRequest (msg, auth, range) {
  return {
    spreadsheetId: SPREADSHEET_ID,
    range,
    insertDataOption: 'INSERT_ROWS',
    valueInputOption: 'RAW',
    resource: {
      values: [
        [
          new Date().toLocaleDateString() +
            ' ' +
            msg.from.first_name +
            ': ' +
            msg.text
        ]
      ]
    },
    auth
  }
}

function getUpdateTotalRequest (total, auth, range) {
  return {
    spreadsheetId: SPREADSHEET_ID,
    range,
    valueInputOption: 'RAW',
    auth,
    resource: {
      values: [[total + 1]]
    }
  }
}

function appendTweet (auth, msg, range = 'A1') {
  return new Promise((resolve, reject) => {
    const values = google.sheets({ version: 'v4', auth }).spreadsheets.values
    values.append(getInsertRequest(msg, auth, range), err => {
      if (err) {
        reject({ Error: err })
      }
      resolve()
    })
  })
}

function updateTotal (auth, cellWithTotal) {
  return new Promise((resolve, reject) => {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${cellWithTotal}?key=AIzaSyBT95iNZMJphiiXzbKUTffs8T3TFVwf8XM`
    request({ url, json: true }, (err, res, json) => {
      const total = +json.values[0][0]
      const values = google.sheets({ version: 'v4', auth }).spreadsheets.values
      values.update(getUpdateTotalRequest(total, auth, cellWithTotal), err => {
        if (err) {
          reject({ Error: err })
        }
        resolve(total + 1)
      })
    })
  })
}

module.exports = {
  updateTotal,
  appendTweet,
  SPREADSHEET_ID
}
