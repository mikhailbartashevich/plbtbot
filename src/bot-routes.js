const text = require('./text')
const kitty = require('./kitty')
const crypto = require('./crypto')
const splitwise = require('./splitwise')
const movies = require('./movies')
const keywords = require('./keywords')

const COMMANDS = [
  '/context-image',
  '/kitty',
  '/kittygif',
  '/plbt',
  '/xrp',
  '/btc',
  '/fiat'
]

const COLLECTED_MESSAGES = []

function helpMarkup (msg, teleBot) {
  const replyMarkup = teleBot.keyboard([COMMANDS], {
    resize: true,
    once: false
  })
  return teleBot.sendMessage(
    msg.chat.id,
    '😺 Use commands:' + COMMANDS.join(' ') + 'usd_pln pair, and /price crypto',
    { replyMarkup }
  )
}

function initCryptoRoutes (teleBot) {
  teleBot.on(['/price'], msg => crypto.publishCryptoPrice(msg, teleBot))
  teleBot.on(['/xrp'], msg => crypto.publishXrpPrice(msg, teleBot))
  teleBot.on(['/btc'], msg => crypto.publishBtcPrice(msg, teleBot))
  teleBot.on(['/plbt'], msg => crypto.publishPlbtPrice(msg, teleBot))
}

function initSplitwiseRoutes (teleBot) {
  teleBot.on(['/split'], msg => splitwise.addSplit(msg, teleBot))
  teleBot.on(['/debt'], msg => splitwise.addDebt(msg, teleBot))
}

function initKittyRoutes (teleBot) {
  teleBot.on(['/kitty'], msg => kitty.showKitty(msg, teleBot))
  teleBot.on(['/kittygif'], msg => kitty.showKittyGiff(msg, teleBot))
}

function initMoviesRoutes (teleBot) {
  teleBot.on(['/awards'], msg => movies.getMovieInfo(msg, teleBot))
  teleBot.on(['/movies'], msg => movies.searchMovies(msg, teleBot))
}

function initRoutes (teleBot) {
  teleBot.on(['/start', '/help'], msg => helpMarkup(msg, teleBot))

  initKittyRoutes(teleBot)

  initCryptoRoutes(teleBot)

  initSplitwiseRoutes(teleBot)

  initMoviesRoutes(teleBot)

  teleBot.on(['text'], msg =>
    text.textProcessing(msg, teleBot, COLLECTED_MESSAGES)
  )

  teleBot.on(['/context-image'], msg =>
    keywords.publishKeywords(msg, teleBot, COLLECTED_MESSAGES)
  )
}

module.exports = {
  initRoutes
}