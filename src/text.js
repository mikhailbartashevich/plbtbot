const jokes = require('./jokes')
const mongoose = require('mongoose')
mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true }
)

const Tweet = mongoose.model('Tweet', {
  user: String,
  tweet: String,
  date: String
})

const BULBA_ROOTS = JSON.parse(process.env.KARTOSHI)

function updateMessages (messages, text) {
  messages.push(text)
  if (messages.length > process.env.MESSAGES_COUNTER) {
    messages.shift()
  }
}

function memasiki (msg, teleBot) {
  const id = msg.chat.id
  const text = msg.text.toLowerCase()
  const configs = JSON.parse(process.env.MEMASIKI)

  for (const config of configs) {

    for (const key of config.keys) {
      if (text.includes(key)) {
        teleBot.sendPhoto(id, config.meme, {
          fileName: 'meme.jpg',
          serverDownload: true
        })
        teleBot.sendAction(id, 'upload_photo')
      }
    }

  }
}

function textProcessing (msg, teleBot, collectedMessages) {
  const id = msg.chat.id
  const text = msg.text.toLowerCase()
  const tweet = new Tweet({
    user: msg.from.first_name + ' ' + msg.from.last_name,
    tweet: msg.text,
    date: new Date().toLocaleDateString()
  })
  tweet.save().then(() => console.log('meow'))

  updateMessages(collectedMessages, text)

  memasiki(msg, teleBot)

  if (text.indexOf('мимими') > -1) {
    const url =
      'http://img1.joyreactor.cc/pics/post/%D0%BF%D0%B5%D1%81%D0%BE%D1%87%D0%BD%D0%B8%D1%86%D0%B0-%D0%B2%D0%B5%D1%80%D1%82%D0%BE%D0%BB%D0%B5%D1%82-%D0%BC%D0%B8%D0%BC%D0%B8%D0%BC%D0%B8-%D0%91%D0%B0%D1%8F%D0%BD-908995.jpeg'
    teleBot.sendPhoto(id, url, {
      fileName: 'mimimi.jpg',
      serverDownload: true
    })
    teleBot.sendAction(id, 'upload_photo')
  }

  if (text.indexOf('запомните этот твит') > -1) {
    jokes.rememberTweet(msg, teleBot)
  }

  if (BULBA_ROOTS.findIndex(root => text.indexOf(root) > -1) > -1) {
    jokes.kartoshkaJoke(msg, teleBot)
  }

  if (text.indexOf('ебучие джуны') > -1 || text.indexOf('ебучий джун') > -1) {
    jokes.eJunior(msg, teleBot)
  }
}

function meText (msg, teleBot) {
  const user = msg.from.first_name + ' ' + msg.from.last_name
  const parts = msg.text.split(' ')
  parts.shift() // command

  teleBot.sendMessage(msg.chat.id, user + ' ' + parts.join(' '))
}

module.exports = {
  textProcessing,
  meText
}
