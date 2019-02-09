const mongoose = require('mongoose')
mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true }
)

const Salary = mongoose.model('Salary', {
  user: String,
  salary: Number,
  comment: String,
  date: String
})

function publishSalary (msg, teleBot) {
  const query = Salary.find({})
  query.exec(function (err, docs) {
    if (err) {
      teleBot.sendMessage(msg.chat.id, 'чот еррор')
      return
    }
    let response = '<table>';
    docs.forEach(doc => {
      response +=
        '<tr><td>' + doc.user + ' ' + doc.salary + ' ' + doc.comment + '</td></tr>'
    })
    response += '</table>';
    teleBot.sendMessage(msg.chat.id, response, {
      parseMode: 'HTML'
    })
  })
}

function addSalary (msg, teleBot) {
  const parts = msg.text.split(' ')
  parts.shift() // command
  const tweet = new Salary({
    user: parts.shift(),
    salary: parts.shift(),
    comment: parts.join(' '),
    date: new Date().toLocaleString()
  })
  tweet.save().then(() => {
    teleBot.sendMessage(msg.chat.id, 'added salary')
    console.log('meow')
  })
}

function updateSalary (msg, teleBot) {
  const parts = msg.text.split(' ')
  parts.shift() // command
  const query = { user: parts.shift() }
  Salary.findOneAndUpdate(
    query,
    {
      salary: parts.shift(),
      comment: parts.join(' ')
    },
    {},
    () => {
      teleBot.sendMessage(msg.chat.id, '<b>updated salary</b>', {
        parseMode: 'HTML'
      })
    }
  )
}

module.exports = {
  publishSalary,
  addSalary,
  updateSalary
}
