const itemSchema = require('../../models/item')
const config = require('../../config.json')

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

module.exports.run = async (ctx) => {
    var total_items = await itemSchema.countDocuments()
    var messaggio = `---------------Statistiche---------------\n⚫Totali: ${total_items} oggetti nel database\n⚫Percentuale per query:`
    await asyncForEach(config.gpusQueries, async (e) => {
        let items_per_query = await itemSchema.find({ query: e.replaceAll(' ', '-') }).countDocuments()
        let prezzo_medio_query = await itemSchema.aggregate([{ $match: { query: e.replaceAll(' ', '-') } }, { $group: { _id: null, AverageValue: { $avg: "$price" } } }])
        messaggio += `\n    - [${e.replaceAll(' ', '-')}]: ${((items_per_query * 100) / total_items).toFixed(1)}% con prezzo medio di ${prezzo_medio_query[0].AverageValue.toFixed(2)} €`
    })
    var prezzo_medio = await itemSchema.aggregate([{ $group: { _id: null, AverageValue: { $avg: "$price" } } }])
    messaggio += `\n⚫Prezzo medio di tutti gli oggetti: ${prezzo_medio[0].AverageValue.toFixed(2)} €`
    ctx.reply(messaggio)
}