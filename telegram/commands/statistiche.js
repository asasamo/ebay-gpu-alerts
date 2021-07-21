const moment = require('moment')

const itemSchema = require('../../models/item')
const config = require('../../config.json')

const DEFAULT_PRICE_DIFFERENCE_DAYS = 10

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}

async function getPriceDifference(query, days) {
    let oldPrice = await itemSchema.aggregate([{
        $match:
        {
            date: {
                $gt: new Date(moment().subtract(days, 'days')),
                $lt: new Date(moment().subtract(1, 'days'))
            },
            query: query,
            type: 'purchaseNow'
        }
    },
    {
        $group:
        {
            _id: null,
            AverageValue: { $avg: "$price" }
        }
    }])

    let newPrice = await itemSchema.aggregate([{
        $match:
        {
            date:
                { $gt: new Date(moment().subtract(1, 'days')) },
            query: query,
            type: 'purchaseNow'
        }
    }, {
        $group:
        {
            _id: null,
            AverageValue: { $avg: "$price" }
        }
    }])

    return (((newPrice[0].AverageValue - oldPrice[0].AverageValue) / oldPrice[0].AverageValue) * 100).toFixed(2)
}

module.exports.run = async (ctx) => {
    var args = ctx.message.text.split(' ')

    var giorni = !isNaN(args[1]) ? +args[1] : DEFAULT_PRICE_DIFFERENCE_DAYS

    var total_items = await itemSchema.countDocuments()
    var messaggio = `---------------Statistiche---------------\n⚫Totale: ${total_items} oggetti nel database\n⚫Percentuale per query "Compralo Subito":`

    await asyncForEach(config.gpusQueries, async (query) => {
        query = query.replaceAll(' ', '-')

        // Percentuale
        let items_per_query = await itemSchema.find({ query: query }).countDocuments()

        // Prezzo medio per query
        let prezzo_medio_query = await itemSchema.aggregate([{ $match: { date: { $gt: new Date(moment().subtract(1, 'days')) }, query: query, type: 'purchaseNow' } }, { $group: { _id: null, AverageValue: { $avg: "$price" } } }])

        // Differenza di prezzo
        let differenza_percentuale = await getPriceDifference(query, giorni)

        // Composizione Messaggio
        messaggio += `\n    - *${query}*: _${((items_per_query * 100) / total_items).toFixed(1)}%_ oggetti sul totale,\n          prezzo medio: *${prezzo_medio_query[0].AverageValue.toFixed(2)}€*, variazione ${giorni}gg: _${differenza_percentuale > 0 ? '+' : ''}${differenza_percentuale}%_`
    })

    var prezzo_medio_totale = await itemSchema.aggregate([{ $group: { _id: null, AverageValue: { $avg: "$price" } } }])
    messaggio += `\n⚫Prezzo medio di tutti gli oggetti: *${prezzo_medio_totale[0].AverageValue.toFixed(2)} €*`

    ctx.replyWithMarkdown(messaggio)
}

const config = exports.config = {
    command: 'statistiche',
    description: 'Visualizza le statistiche.',
    arguments: {
        options: ['giorni'],
        states: []
    }
}