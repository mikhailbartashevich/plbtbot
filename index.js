require('newrelic')
const TeleBot = require('telebot')
const bot = new TeleBot('538233729:AAHJqMW2om913dzeTOECVxUm3Nb6AMTy7Xo')
const botRoutes = require('./src/bot-routes')
const httpServer = require('./src/http')

botRoutes.initRoutes(bot)
bot.start()

httpServer.startServer()
