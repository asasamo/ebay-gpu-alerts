const moment = require('moment')
const colors = require('colors')

module.exports.info = (info) => {
    console.log(colors.white(`[${moment().format('HH:mm:ss')}] ${info}`))
}

module.exports.error = (error) => {
    console.log(colors.bgRed(`[${moment().format('HH:mm:ss')}] ${error}`))
}

module.exports.newItem = (query, item, fullPrice) => {
    if (fullPrice <= 380) {
        console.log(`[${moment().format('HH:mm:ss')}] ` + colors.black.bgWhite(`New Item for [${query}]`) + ', ' + colors.bgGreen(`${fullPrice}€`) + colors.white(': ' + item))
    } else if (fullPrice <= 500) {
        console.log(`[${moment().format('HH:mm:ss')}] ` + colors.black.bgWhite(`New Item for [${query}]`) + ', ' + colors.bgYellow(`${fullPrice}€`) + colors.white(': ' + item))
    } else if (fullPrice <= 700) {
        console.log(`[${moment().format('HH:mm:ss')}] ` + colors.black.bgWhite(`New Item for [${query}]`) + ', ' + colors.bgRed(`${fullPrice}€`) + colors.white(': ' + item))
    } else {
        console.log(`[${moment().format('HH:mm:ss')}] ` + colors.black.bgWhite(`New Item for [${query}]`) + ', ' + colors.bgGray(`${fullPrice}€`) + colors.white(': ' + item))
    }
}