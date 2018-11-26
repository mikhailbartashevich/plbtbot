const request = require('request')

function sendMovies (id, movies, i, teleBot) {
  const movie = movies[i]
  if (movie) {
    teleBot
      .sendMessage(id, `${movie.Title} ${movie.Year}`)
      .then(_ =>
        bot.sendPhoto(id, movie.Poster, {
          fileName: 'image.jpg',
          serverDownload: true
        })
      )
      .then(_ => {
        sendMovies(id, movies, i + 1)
      })
      .catch(_ => {
        console.log(_)
        sendMovies(id, movies, i + 1)
      })
  }
}

function getMovieInfo (msg, teleBot) {
  let id = msg.chat.id
  const arr = msg.text.split(' ')
  arr.shift()
  let title = arr.join('+')
  request(
    {
      url: `http://www.omdbapi.com/?t=${title}&apikey=ad5027a4&type=movie`,
      json: true
    },
    function (err, res, json) {
      const movies = [json]
      teleBot.sendMessage(id, 'Found Info:').then(_ => {
        movies.forEach(movie => {
          teleBot
            .sendMessage(
              id,
              `${movie.Title} ${movie.Director} ${movie.Awards} ${movie.BoxOffice} https://www.imdb.com/title/${movie.imdbID}/`
            )
            .then(_ => {
              teleBot
                .sendPhoto(id, movie.Poster, {
                  fileName: 'image.jpg',
                  serverDownload: true
                })
                .catch(console.log)
            })
        })
      })
    }
  )
}

function searchMovies (msg, teleBot) {
  const id = msg.chat.id
  const title = msg.text.split(' ')[1] || 'cat'
  const page = msg.text.split(' ')[2] || '1'
  request(
    {
      url: `http://www.omdbapi.com/?s=${title}&apikey=ad5027a4&type=movie&page=${page}`,
      json: true
    },
    function (err, res, json) {
      const movies = json.Search || []
      teleBot.sendMessage(id, 'Found Movies:').then(_ => {
        sendMovies(id, movies, 0, teleBot)
      })
    }
  )
}

module.exports = {
  getMovieInfo,
  searchMovies
}
