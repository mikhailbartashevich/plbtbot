const jokes = require('./jokes')

const BULBA_ROOTS = ['картош', 'картоф', 'бульб', 'картох', 'картоп']

function updateMessages (messages, text) {
  messages.push(text)
  if (messages.length > process.env.MESSAGES_COUNTER) {
    messages.shift()
  }
}

function textProcessing (msg, teleBot, collectedMessages) {
  const text = msg.text.toLowerCase()
  console.log(msg.from.first_name + ' ' + msg.from.last_name + ': ' + msg.text);
  updateMessages(collectedMessages, text)

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

module.exports = {
  textProcessing
}
