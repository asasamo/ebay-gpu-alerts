require('dotenv').config()

const { searchNewlyAdded } = require('./ebay-api/api')
const log = require('./logger')
const _ = require('lodash')
const mongoose = require('mongoose')
const { botSend } = require('./telegram/telegram')

const config = require('./config.json')

const itemSchema = require('./models/item')


function start() {
    setTimeout(() => {
        log.info('Searching...')
        config.gpusQueries.forEach(async (query, index) => {
            let results = await searchNewlyAdded(query)
            results.forEach((result, i) => {
                new itemSchema(result)
                    .save(async (err, result) => {
                        if (!err) {
                            log.newItem(query, result)
                            log.telegramBot(await botSend(result))
                        }
                    })
            })
        })

        start()
    }, config.delay * 1000)
}

log.info('Bot started!')
mongoose.connect(config.MongoDB.replace('{{user}}',
    process.env.MONGODB_USER).replace('{{pass}}',
        process.env.MONGODB_PASS).replace('{{db}}', process.env.MONGODB_DB),
    { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
        if (err) {
            log.error(err)
            process.exit(1)
        }
    })

start()