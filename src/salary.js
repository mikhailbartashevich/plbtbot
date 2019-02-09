const mongoose = require('mongoose')
mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true }
)

const Salary = mongoose.model('Salary', {
  user: String,
  salary: Number,
  comment: String,
  date: String,
})

function publishSalary (msg, teleBot) {
  const query = Salary.find({})
  query.exec(function (err, docs) {
    if (err) {
      teleBot.sendMessage(msg.chat.id, 'чот еррор')
      return
    }
    const response = ''
    docs.forEach(
      doc =>
        (response +=
          '<pre>' + doc.user + ' ' + doc.salary + ' ' + doc.comment + '</pre>')
    )
    teleBot.sendMessage(msg.chat.id, response, {
      parseMode: 'HTML'
    })
  })
}

function addSalary (msg, teleBot) {
  const parts = msg.split(' ');
  const tweet = new Salary({
    user: parts[1],
    salary: parts[2],
    comment: parts[3],
    date: new Date().toLocaleString()
  });
  tweet.save().then(() => {
    teleBot.sendMessage(msg.chat.id, '<b>added salary</b>', {
      parseMode: 'HTML'
    })
    console.log('meow')
  });

}

module.exports = {
  publishSalary,
  addSalary
}
