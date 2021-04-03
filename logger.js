const moment = require('moment')
const colors = require('colors')

module.exports.info = (info) => {
    console.log(colors.white(`[${moment().format('HH:mm:ss')}] ${info}`))
}

module.exports.error = (error) => {
    console.log(colors.bgRed(`[${moment().format('HH:mm:ss')}] ${error}`))
}

module.exports.newItem = (query, item, fullPrice) => {
    if (fullPrice < 380) {
        console.log(colors.bgMagenta(`[${moment().format('HH:mm:ss')}] New Item for [${query}], ${fullPrice}€: ${item}`))
    } else {
        console.log(colors.bgGreen(`[${moment().format('HH:mm:ss')}] New Item for [${query}], ${fullPrice}€: ${item}`))
    }
}