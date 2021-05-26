const itemSchema = require('../../models/item')
const config = require('../../config.json')

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
}

module.exports.run = async (ctx) => {
    var total_items = await itemSchema.countDocuments()
    var messaggio = `---------------Statistiche---------------\n⚫Totali: ${total_items} oggetti\n⚫Percentuale per query:`
    await asyncForEach(config.gpusQueries, async (e) => {
        let numero_per_query = await itemSchema.find({ query: e.replaceAll(' ', '-') }).countDocuments()
        messaggio += `\n    - [${e.replaceAll(' ', '-')}]: ${((numero_per_query * 100) / total_items).toFixed(1)}%`
    })
    var prezzo_medio = await itemSchema.aggregate([{$group: {_id:null, AverageValue: {$avg:"$price"} } }])
    messaggio += `\n⚫Prezzo medio: ${prezzo_medio[0].AverageValue.toFixed(2)}€`
    ctx.reply(messaggio)
}