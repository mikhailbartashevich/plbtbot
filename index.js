const httpServer = require('./src/http')

botRoutes.initRoutes(bot)
bot.start()

httpServer.startServer()
