const request = require('request')
const API =
  'https://api.thedogapi.com/v1/images/search?api_key=' +
  process.env.THE_DOG_API_KEY +
  '&limit=1&size=full&mime_types=jpg,png'
const API_GIF =
  'https://api.thedogapi.com/v1/images/search?api_key=' +
  process.env.THE_DOG_API_KEY +
  '&limit=1&size=full&mime_types=gif'

function showDoggy (msg, teleBot) {
  const id = msg.chat.id

  request(
    {
      url: API,
      json: true
    },
    function (err, res, json) {
      console.log(json)
      teleBot.sendPhoto(id, json[0].url, {
        fileName: 'doggy.jpg',
        serverDownload: true
      })
      teleBot.sendAction(id, 'upload_photo')
    }
  )
}

function showDoggyGif (msg, teleBot) {
  const id = msg.chat.id
  request(
    {
      url: API_GIF,
      json: true
    },
    function (err, res, json) {
      teleBot.sendDocument(id, json[0].url, {
        fileName: 'doggy.gif',
        serverDownload: true
      })
      teleBot.sendAction(id, 'upload_photo')
    }
  )
}

module.exports = {
  showDoggy,
  showDoggyGif
}
