const Splitwise = require('splitwise')
const kitty = require('./kitty')

const splitwiseAPI = Splitwise({
  consumerKey: process.env.SPLITWISE_CONSUMER_KEY,
  consumerSecret: process.env.SPLITWISE_SECRET
})

const USERS = {
  437814936: { user_id: '6181181' },
  281548620: { user_id: '6181165' }
}

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

function sendRequest (msg, users, teleBot) {
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

function addSplit (msg, teleBot) {
  const arr = msg.text.split(' ')
  arr.shift() // command
  const cost = getDebtCost(arr.shift())
  const users = USERS
  const half = Number((cost / 2).toFixed(2))
  users[437814936].owed_share = half
  users[281548620].owed_share = half
  const foundUser = users[msg.from.id]
  if (foundUser) {
    foundUser.paid_share = cost
    sendRequest(msg, users, teleBot)
  }
}

function addDebt (msg, teleBot) {
  const arr = msg.text.split(' ')
  arr.shift() // command
  const cost = getDebtCost(arr.shift())
  const users = USERS
  users[437814936].owed_share = cost
  users[281548620].owed_share = cost
  const foundUser = users[msg.from.id]
  if (foundUser) {
    foundUser.paid_share = cost
    foundUser.owed_share = 0
    sendRequest(msg, users, teleBot)
  }
}

module.exports = {
  addDebt,
  addSplit
}
