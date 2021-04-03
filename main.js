require('dotenv').config()

const { searchNewlyAdded } = require('./ebay-api/api')
const log = require('./logger')
const _ = require('lodash')
const mongoose = require('mongoose')

const config = require('./config.json')

const itemSchema = require('./models/item')

function parseQueries(queryArray) {
    let resultArray = []
    queryArray.forEach((v) => {
        resultArray.push(v.split(' ').join('+'))
    })
    return resultArray
}

async function start() {
    log.info('Searching...')
    let results = await searchNewlyAdded('rtx+3060')
    results.forEach((result, i) => {
        new itemSchema(result)
            .save((err, result) => {
                if (!err) {
                    log.newItem(result.title)
                }
            })
    })

    await setInterval(() => {
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