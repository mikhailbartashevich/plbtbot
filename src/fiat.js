const request = require('request')
const kitty = require('./kitty')

function getFiatPrice (pair) {
  const splitted = pair.split('_')
  const base = splitted[0].toUpperCase()
  const symbol = splitted[1].toUpperCase()
  return new Promise((resolve, reject) => {
    request(
      {
        url: `https://api.ratesapi.io/api/latest?symbols=${symbol}&base=${base}`,
        json: true
      },
      function (err, res, json) {
        if(err || !json.rates || !json.rates[symbol] ) {
          reject('Error')
        } else {
          resolve(json.rates[symbol])
        }
      }
    )
  })
}

function publishFiat (msg, teleBot) {
  const pair = msg.text.split(' ')[1] || 'usd_pln'
  getFiatPrice(pair)
    .then(price => {
      let message = `The price is ${price}.`

      if (pair.toLowerCase() === 'usd_pln') {
        if (price > 3.75) {
          message += ` You are too rich for the kitty!`
        } else {
          message += ` 😿 Here is a kitty for the team.`
          kitty
            .showKitty(msg, teleBot)
            .catch(error => console.log('[error]', error))
        }
      }

      teleBot.sendMessage(msg.chat.id, message)
    })
    .catch(_ => teleBot.sendMessage(msg.chat.id, 'Pair not found'))
}

module.exports = {
  publishFiat
}
