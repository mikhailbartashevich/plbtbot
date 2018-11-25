const request = require('request')
const kitty = require('./kitty')

function getFiatPrice (pair) {
  return new Promise((resolve, reject) => {
    request(
      {
        url: `http://free.currencyconverterapi.com/api/v5/convert?q=${pair}&compact=y`,
        json: true
      },
      function (err, res, json) {
        const keys = Object.keys(json)
        const key = keys.length ? keys[0] : ''
        if (!key) reject()
        resolve(json[key].val)
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
