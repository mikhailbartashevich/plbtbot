const request = require('request')
const kitty = require('./kitty')

function getCryptoInfo (crypto) {
  return new Promise((resolve, reject) => {
    request(
      { url: 'https://api.coinmarketcap.com/v2/listings/', json: true },
      (err, res, json) => {
        if (err) reject(err)
        const cryptoInfo = json.data.find(
          cr => cr.symbol.toLowerCase() === crypto.toLowerCase()
        )
        resolve(cryptoInfo)
      }
    )
  })
}

function getCryptoPrice (cryptoInfo) {
  return new Promise((resolve, reject) => {
    if (!cryptoInfo) reject()
    request(
      {
        url: `https://api.coinmarketcap.com/v2/ticker/${cryptoInfo.id}/`,
        json: true
      },
      (err, res, json) => {
        if (err) reject(err)
        resolve(json.data.quotes.USD.price)
      }
    )
  })
}

function publishCryptoPrice (msg, teleBot) {
  const crypto = msg.text.split(' ')[1] || ''
  const id = msg.chat.id
  getCryptoInfo(crypto)
    .then(info => getCryptoPrice(info))
    .then(price => teleBot.sendMessage(id, `The price is ${price}.`))
    .catch(_ => teleBot.sendMessage(id, `Crypto is not found.`))
}

function getCryptoMessage (price, terminator) {
  if (price > terminator) {
    return `The price is ${price}. No Kitty enjoy money. To the moon!`
  }
  return `The price is ${price}. Seriously ?! 😿 Here is a kitty for the team.`
}

function getCryptoChatPhoto (price) {
  if (price > terminator) {
    return 'https://www.outerplaces.com/media/k2/items/cache/7db160bf373b0765b084bfc22d0899cc_L.jpg'
  }
  return 'https://cdn.pixabay.com/photo/2017/11/19/13/03/panorama-2962730_960_720.jpg'
}

function getCryptoChatTitle (price) {
  if (price > terminator) {
    return 'КТИ'
  }
  return 'ГКТИ'
}

function publishBtcPrice (msg, teleBot) {
  const id = msg.chat.id
  getCryptoPrice({ id: 1 })
    .then(price => {
      teleBot.sendMessage(id, getCryptoMessage(price, 8000))
      teleBot
        .setChatPhoto(id, getCryptoChatPhoto(price, 8000), {
          serverDownload: true
        })
        .catch(error => console.log('[error]', error))
      teleBot
        .setChatTitle(id, getCryptoChatTitle(price, 10000))
        .catch(error => console.log('Error:', error))
      kitty
        .showKitty(msg, teleBot)
        .catch(error => console.log('[error]', error))
    })
    .catch(error => console.log('[error]', error))
}

function getXrpMessage (price, terminator) {
  if (price > terminator) {
    return `The price is ${price}. No Kitty enjoy money. To the moon!`
  }
  return `The price is ${price}. 😿 Here is a kitty for Gore Traders.`
}

function publishXrpPrice (msg, teleBot) {
  const id = msg.chat.id
  getCryptoPrice({ id: 52 })
    .then(price => {
      teleBot.sendMessage(id, getXrpMessage(price, 1.5))
      teleBot
        .setChatTitle(id, getCryptoChatTitle(price, 1.5))
        .catch(error => console.log('Error:', error))
      kitty
        .showKitty(msg, teleBot)
        .catch(error => console.log('[error]', error))
    })
    .catch(error => console.log('[error]', error))
}

function getPlbtMessage (price, terminator) {
  if (price > terminator) {
    return `The price is ${price}. No Kitty enjoy money. Yura is a rich man!`
  }
  return `The price is ${price}. 😿 Here is a kitty for Yura.`
}

function getPlbtChatTitle (price) {
  if (price > terminator) {
    return 'ГКТИиЮ'
  }
  return 'ГКТИ'
}

function publishPlbtPrice (msg, teleBot) {
  const id = msg.chat.id
  getCryptoPrice({ id: 1784 })
    .then(price => {
      teleBot.sendMessage(id, getPlbtMessage(price, 4))
      teleBot
        .setChatTitle(id, getPlbtChatTitle(price, 4))
        .catch(error => console.log('Error:', error))
      kitty
        .showKitty(msg, teleBot)
        .catch(error => console.log('[error]', error))
    })
    .catch(error => console.log('[error]', error))
}

module.exports = {
  publishCryptoPrice,
  publishPlbtPrice,
  publishBtcPrice,
  publishXrpPrice
}

// let interval = 0
// let intervalTime = 0

// bot.on(['/plbtInterval'], function (msg) {
//   let id = msg.chat.id
//   const time = msg.text.split(' ')[1] || 10000
//   intervalTime = parseInt(time, 10)
//   clearInterval(interval)
//   interval = setInterval(() => checkPlbtPrice(id), intervalTime)
//   bot.sendMessage(id, `Interval ${intervalTime} started.`)
// })

// bot.on(['/stopInterval'], function (msg) {
//   let id = msg.chat.id
//   clearInterval(interval)
//   bot.sendMessage(id, `Interval ${intervalTime} stopped.`)
// })
