const request = require('request')

function checkFiatPrice (id, pair) {
  request(
    {
      url: `http://free.currencyconverterapi.com/api/v5/convert?q=${pair}&compact=y`,
      json: true
    },
    function (err, res, json) {
      const keys = Object.keys(json)
      const key = keys.length ? keys[0] : ''
      let message = ''

      if (key) {
        const price = json[key].val
        message = `The price is ${price}.`

        if (pair.toLowerCase() === 'usd_pln') {
          if (price > 3.75) {
            message += ` You are too rich for the kitty!`
          } else {
            message += ` 😿 Here is a kitty for the team.`
            showKitty(id, '/kitty').catch(error =>
              console.log('[error]', error)
            )
          }
        }
      } else {
        message = `No such fiat pair.`
      }

      bot.sendMessage(id, message)
    }
  )
}

bot.on(['/fiat'], function (msg) {
  const id = msg.chat.id
  const pair = msg.text.split(' ')[1] || 'usd_pln'
  checkFiatPrice(id, pair)
})
