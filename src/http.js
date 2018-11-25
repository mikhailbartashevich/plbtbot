const http = require('http')

function startServer () {
  http
    .createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' })
      res.write(
        'Welcome to @PolybiusBot. It is a Telegram bot. To use it open Telegram app.'
      )
      res.end()
    })
    .listen(process.env.PORT || 3000)
}

module.exports = {
  startServer
}
