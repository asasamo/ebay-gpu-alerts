const moment = require('moment')
const colors = require('colors')

module.exports.info = (info) => {
    console.log(colors.white(`[${moment().format('HH:mm:ss')}] ${info}`))
}

module.exports.error = (error) => {
    console.log(colors.bgRed(`[${moment().format('HH:mm:ss')}] ${error}`))
}

module.exports.newItem = (item) => {
    console.log(colors.bgGreen(`[${moment().format('HH:mm:ss')}] New Item: ${item}`))
}