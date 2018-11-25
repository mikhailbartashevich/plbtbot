const Splitwise = require('splitwise')
const kitty = require('./kitty')

const splitwiseAPI = Splitwise({
  consumerKey: process.env.SPLITWISE_CONSUMER_KEY,
  consumerSecret: process.env.SPLITWISE_SECRET
})
function getDebtCost (cost) {
  if (!cost) return 0
  return parseFloat(cost, 10)
}

function splitwiseCreate (msg, users) {
  const arr = msg.text.split(' ')
  arr.shift() // command
  const stringCost = arr.shift()
  const cost = getDebtCost(stringCost)

  return splitwiseAPI.createExpense({
    users,
    group_id: process.env.SPLITWISE_GROUP,
    currency_code: stringCost.replace(cost, '').toUpperCase() || 'PLN',
    cost,
    payment: false,
    description: arr.length ? arr.join(' ') : 'SplitKot'
  })
}

function addSplit (msg, teleBot) {
  const arr = msg.text.split(' ')
  arr.shift() // command
  const cost = getDebtCost(arr.shift())
  const users = {
    437814936: { user_id: '6181181', owed_share: cost / 2 },
    281548620: { user_id: '6181165', owed_share: cost / 2 }
  }
  const foundUser = users[msg.from.id]
  if (foundUser) {
    foundUser.paid_share = cost
    splitwiseCreate(msg, [users[437814936], users[281548620]]).then(
      success => {
        teleBot.sendMessage(msg.chat.id, 'Expense added')
        kitty
          .showKitty(msg, teleBot)
          .catch(error => console.log('[error]', error))
      },
      err => {
        teleBot.sendMessage(msg.chat.id, 'Expense error')
      }
    )
  }
}

function addDebt (msg, teleBot) {
  const arr = msg.text.split(' ')
  arr.shift() // command
  const cost = getDebtCost(arr.shift())
  const users = {
    437814936: { user_id: '6181181', owed_share: cost },
    281548620: { user_id: '6181165', owed_share: cost }
  }
  const foundUser = users[msg.from.id]
  if (foundUser) {
    foundUser.paid_share = cost
    foundUser.owed_share = 0
    splitwiseCreate(msg, [users[437814936], users[281548620]]).then(
      success => {
        teleBot.sendMessage(msg.chat.id, 'Expense added')
        kitty
          .showKitty(msg, teleBot)
          .catch(error => console.log('[error]', error))
      },
      err => {
        teleBot.sendMessage(msg.chat.id, 'Expense error')
      }
    )
  }
}

module.exports = {
  addDebt,
  addSplit
}
