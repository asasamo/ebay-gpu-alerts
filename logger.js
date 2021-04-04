const moment = require('moment')
const colors = require('colors')

module.exports.info = (info) => {
    console.log(colors.white(`[${moment().format('HH:mm:ss')}] ${info}`))
}

module.exports.error = (error) => {
    console.log(colors.bgRed(`[${moment().format('HH:mm:ss')}] ${error}`))
}

module.exports.newItem = (query, { title, type, conditions, price, shippingCost, location }) => {
    let fullPrice = (price + shippingCost).toFixed(2)

    var first = colors.black.bgWhite(`New Item for "${query}": `)
    if (fullPrice <= 450) {
        this.info(first + colors.bgGreen(`[${price}€ / ${shippingCost}€]`) + ' ' + `[${conditions}][${type}][${location}]: ${title}`)
    } else if (fullPrice <= 550) {
        this.info(first + colors.bgYellow(`[${price}€ / ${shippingCost}€]`) + ' ' + `[${conditions}][${type}][${location}]: ${title}`)
    } else if (fullPrice <= 700) {
        this.info(first + colors.bgRed(`[${price}€ / ${shippingCost}€]`) + ' ' + `[${conditions}][${type}][${location}]: ${title}`)
    } else {
        this.info(first + colors.bgGray(`[${price}€ / ${shippingCost}€]`) + ' ' + `[${conditions}][${type}][${location}]: ${title}`)
    }
}

module.exports.telegramBot = (botResult) => {
    this.info(colors.bgMagenta(`Telegram Bot: ${botResult}`))
}