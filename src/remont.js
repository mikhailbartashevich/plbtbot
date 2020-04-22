const request = require('request')

bot.on(['/remont'], function (msg) {
  let id = msg.chat.id
  checkRemontPrice(id)
})

function checkRemontPrice (id) {
  const renovationURL = `https://sheets.googleapis.com/v4/spreadsheets/1ZXASrDKPS2oF-UkrydC2N6khMuyJnanRctiEqu1wvEw/values/H16?key=AIzaSyBT95iNZMJphiiXzbKUTffs8T3TFVwf8XM`

  request({ url: renovationURL, json: true }, function (err, res, json) {
    const total = json.values[0][0]
    bot.sendMessage(id, `Yura the Rich spent already for renovation: ${total}`)
  })
}
