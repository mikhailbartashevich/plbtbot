require('newrelic')
const TeleBot = require('telebot')
const bot = new TeleBot(process.env.BOT_ID)
const botRoutes = require('./src/bot-routes')
const httpServer = require('./src/http')

botRoutes.initRoutes(bot)
bot.start()

httpServer.startServer()
