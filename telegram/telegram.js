const { Telegraf } = require('telegraf')
const _ = require('lodash')
const log = require('../logger')

const bot = new Telegraf(process.env.BOT_TOKEN)

const whitelistSchema = require('../models/whitelist')


bot.command('statistiche', require('./commands/statistiche').run)
bot.command('whitelist', require('./commands/whitelist').run)

//notifiche
var notifiche = require('./commands/notifiche')
bot.command(notifiche.config.command, notifiche.run)

bot.start(async (ctx) => {
    var users = await whitelistSchema.find({})
    var chatIds = []
    users.forEach(user => {
        chatIds.push(user.chatId)
    })
    if (!chatIds.includes(ctx.chat.id)) {
        log.botNewUser(ctx.chat)
        bot.telegram.sendMessage(_.find(users, { isAdmin: true }).chatId, `Nuovo utente:\nUsername ${ctx.chat.username}\nChatId: ${ctx.chat.id}`)
    }
})

module.exports.botSend = async (query, { url, title, image, type, conditions, price, shippingCost, location }) => {
    var users = await whitelistSchema.find({})
    users.forEach(user => {
        let caption = `Nuovo oggetto trovato per [${query}]:\n-Titolo: ${title}\n-Prezzo: ${price}€ / ${shippingCost}€\n-Tipo inserzione: ${type}\n-Condizioni: ${conditions}\n-Posizione: ${location}\n-Link: ${url}`
        if ((price + shippingCost) <= 550) {
            caption = '🔴🔴🔴\n' + caption
        }
        bot.telegram.sendPhoto(user.chatId,
            image,
            { caption: caption }
        ).catch((err) => {
            log.error(err)
            botNotify(err)
            return 'notification error'
        })
    })
    return 'notification sent'
}

module.exports.botNotify = async (message) => {
    var admin = await whitelistSchema.findOne({ isAdmin: true })
    bot.telegram.sendMessage(admin.chatId, `Notifica: ${message}`)
}

bot.launch()
