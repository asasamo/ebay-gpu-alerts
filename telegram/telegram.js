const { Telegraf } = require('telegraf')
const log = require('../logger')
const config = require('../config.json')

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.command('oldschool', (ctx) => ctx.reply('Hello'))
bot.command('hipster', Telegraf.reply('λ'))
bot.launch()
Telegraf.Types
module.exports.botSend = async ({ url, title, image, type, conditions, price, shippingCost, location }) => {
    config.telegramUsers.forEach(chatId => {
        bot.telegram.sendPhoto(chatId,
            image,
            { caption: `${title} - ${price}€ / ${shippingCost}€ - ${type} - ${conditions} - ${location} - ${url}` }
        ).catch((err) => log.error(err))
    })
    return 'done'
}


// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))