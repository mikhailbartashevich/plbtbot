const API = 'https://thecatapi.com/api/images/get?format=src&type='

function showKitty (msg, teleBot) {
  const id = msg.chat.id
  const promise = teleBot.sendPhoto(id, API + 'jpg', {
    fileName: 'kitty.jpg',
    serverDownload: true
  })
  teleBot.sendAction(id, 'upload_photo')
  return promise
}

function showKittyGiff (msg, teleBot) {
  const id = msg.chat.id
  const promise = bot.sendDocument(id, API + 'gif#', {
    fileName: 'kitty.gif',
    serverDownload: true
  })
  bot.sendAction(id, 'upload_photo')
  return promise
}

module.exports = {
  showKitty,
  showKittyGiff
}
