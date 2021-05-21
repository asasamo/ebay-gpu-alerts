const { Telegraf } = require('telegraf')
const log = require('../logger')
const config = require('../config.json')

const item = require('../models/item')

const bot = new Telegraf(process.env.BOT_TOKEN)

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

bot.command('statistiche', async (ctx) => {
    var total_items = await item.countDocuments()
    var messaggio = `---------------Statistiche---------------\n⚫Totali: ${total_items} oggetti\n⚫Percentuale per query:`
    await asyncForEach(config.gpusQueries, async (e) => {
        let numero_per_query = await item.find({ query: e.replaceAll(' ', '-') }).countDocuments()
        messaggio += `\n    - [${e.replaceAll(' ', '-')}]: ${((numero_per_query * 100) / total_items).toFixed(1)}%`
    })
    var prezzo_medio = await item.aggregate([{$group: {_id:null, AverageValue: {$avg:"$price"} } }])
    messaggio += `\n⚫Prezzo medio: ${prezzo_medio[0].AverageValue.toFixed(2)}€`
    ctx.reply(messaggio)
})

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
