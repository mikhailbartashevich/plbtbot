const request = require('request')
const kitty = require('./kitty')

function keywords (translatedText) {
  return new Promise((resolve, reject) => {
    request.post(
      {
        url: 'http://apis.paralleldots.com/v3/keywords',
        json: true,
        form: {
          text: translatedText.toString(),
          api_key: process.env.PARALLEL_DOTS_KEY
        }
      },
      function (err, httpResponse, body) {
        if (err) {
          reject({ Error: err })
        }
        resolve(body)
      }
    )
  })
}

function translate (text) {
  return new Promise((resolve, reject) => {
    request.get(
      {
        url: `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${process.env.YANDEX_API_KEY}&text=${encodeURIComponent(text)}&lang=ru-en`,
        json: true
      },
      function (err, httpResponse, body) {
        if (err) {
          reject({ Error: err })
        }
        resolve(body.text)
      }
    )
  })
}

function getImages (text) {
  return new Promise((resolve, reject) => {
    setTimeout(
      () =>
        request.get(
          {
            url: `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${encodeURIComponent(text)}`,
            json: true
          },
          function (err, httpResponse, body) {
            if (err) {
              reject({ Error: err })
            }
            resolve(body.hits)
          }
        ),
      1000
    )
  })
}

function showFoundImage (id, hits, teleBot) {
  if (hits && hits[0]) {
    teleBot
      .sendPhoto(id, hits[0].webformatURL, {
        fileName: 'contextImage.jpg',
        serverDownload: true
      })
      .catch(console.log)
  } else {
    kitty.showKitty(msg, teleBot).catch(error => console.log('[error]', error))
  }
}

function publishKeywords (msg, teleBot, collectedMessages) {
  translate(collectedMessages.join(' '))
    .then(text => keywords(text))
    .then(response => {
      console.log(response)
      const confidentWords = response.keywords && response.keywords.filter
        ? response.keywords.filter(keyword => keyword.confidence_score > 0.93)
        : []

      confidentWords.sort((a, b) => b.confidence_score - a.confidence_score)

      if (confidentWords.length) {
        const foundKeys = confidentWords.map(word => word.keyword)
        teleBot.sendMessage(msg.chat.id, foundKeys.join(' '))
        return foundKeys.slice(0, 5)
      } else {
        teleBot.sendMessage(msg.chat.id, 'No confidence in keywords')
        return 'cat'
      }
    })
    .then(foundKeys => Promise.all(foundKeys.map(text => getImages(text))))
    .then(results => {
      results.forEach(response => {
        showFoundImage(msg.chat.id, response, teleBot)
      })
    })
    .catch(error => {
      console.log(error)
    })
}

module.exports = {
  publishKeywords
}
