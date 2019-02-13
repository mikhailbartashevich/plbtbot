const request = require('request')
const API = 'https://api.thedogapi.com/v1/images/search?api_key=ad0be3ef-8995-4f8d-a3dd-c4f6ffc1de46&limit=1&size=full'

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

// function showDoggyGiff (msg, teleBot) {
//   const id = msg.chat.id
//   const promise = teleBot.sendDocument(id, API + 'gif#', {
//     fileName: 'doggy.gif',
//     serverDownload: true
//   })
//   teleBot.sendAction(id, 'upload_photo')
//   return promise
// }

module.exports = {
  showDoggy
  // showDoggyGiff
}
