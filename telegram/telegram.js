const { Telegraf } = require('telegraf')
const log = require('../logger')
const config = require('../config.json')

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) => {
    if (!config.telegramUsers.includes(ctx.chat.id)) {
        log.botNewUser(ctx.chat)
        bot.telegram.sendMessage(config.telegramAdmin, `Nuovo utente:\nUsername ${ctx.chat.username}\nChatId: ${ctx.chat.id}`)
    }
})


module.exports.botSend = async (query, { url, title, image, type, conditions, price, shippingCost, location }) => {
    config.telegramUsers.forEach(chatId => {
        let caption = `Nuovo oggetto trovato per [${query}]:\n-Titolo: ${title}\n-Prezzo: ${price}€ / ${shippingCost}€\n-Tipo inserzione: ${type}\n-Condizioni: ${conditions}\n-Posizione: ${location}\n-Link: ${url}`
        if ((price + shippingCost) <= 550) {
            bot.telegram.sendPhoto(chatId,
                image,
                { caption: '🔴🔴🔴\n' + caption }
            ).catch((err) => {
                log.error(err)
                return 'notification error'
            })
        } else {
            bot.telegram.sendPhoto(chatId,
                image,
                { caption: caption }
            ).catch((err) => {
                log.error(err)
                return 'notification error'
            })
        }
    })
    return 'notification sent'
}

module.exports.botNotify = async (message) => {
    bot.telegram.sendMessage(config.telegramAdmin, `Notifica: ${message}`)
}

bot.launch()
