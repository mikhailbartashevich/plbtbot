const fs = require('fs')
const path = require('path')
const tweets = require('./tweets')
const spreadsheet = require('./spreadsheet')

const CREDENTIALS_PATH = '../credentials.json'

const FACE_PALM_IMG =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Paris_Tuileries_Garden_Facepalm_statue.jpg/300px-Paris_Tuileries_Garden_Facepalm_statue.jpg'

const LUKA_IMG =
  'http://www.forumdaily.com/wp-content/uploads/2015/08/aleksandr-lukashenko-s-synom-dobyvaet-kartoshku_rect_ffaaec783c367451f74a5ba4605cbe90.jpeg'

function processEJunior (auth, { msg, teleBot }) {
  const callbackMessage = 'Опять ебучий джун?'
  const id = msg.chat.id
  tweets
    .appendTweet(auth, msg, 'C:C')
    .then(() => tweets.updateTotal(auth, 'C2'))
    .then(total => {
      teleBot.sendPhoto(id, FACE_PALM_IMG, {
        fileName: 'image.jpg',
        serverDownload: true
      })
      teleBot.sendMessage(id, `${callbackMessage} Нашучено: ${total}`)
    })
}

function processKartoshkaJoke (auth, { msg, teleBot }) {
  const callbackMessage = 'Что это, еще одна бульба-шутка?'
  const id = msg.chat.id
  tweets
    .appendTweet(auth, msg, 'B:B')
    .then(() => tweets.updateTotal(auth, 'B2'))
    .then(total => {
      teleBot.sendPhoto(id, LUKA_IMG, {
        fileName: 'image.jpg',
        serverDownload: true
      })
      teleBot.sendMessage(id, `${callbackMessage} Нашучено: ${total}`)
    })
}

function processTweets (auth, { msg, teleBot }) {
  tweets.appendTweet(auth, msg).then(() => {
    teleBot.sendMessage(
      msg.chat.id,
      `Remembered. https://docs.google.com/spreadsheets/d/${tweets.SPREADSHEET_ID}`
    )
  })
}

const CREDENTIALS = {
  client_id: process.env.PANTHEON_CLIENT_ID,
  client_secret: process.env.PANTHEON_CLIENT_SECRET,
  redirect_uris: ['https://plbtbot.herokuapp.com/oauth2callback']
}

// public
function eJunior (msg, teleBot) {
  spreadsheet.authorize(CREDENTIALS, processEJunior, { msg, teleBot })
}

function kartoshkaJoke (msg, teleBot) {
  spreadsheet.authorize(CREDENTIALS, processEJunior, { msg, teleBot })
}

function rememberTweet (msg, teleBot) {
  spreadsheet.authorize(CREDENTIALS, processEJunior, { msg, teleBot })
}

module.exports = {
  rememberTweet,
  eJunior,
  kartoshkaJoke
}
