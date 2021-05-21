const mongoose = require('mongoose')

const { gpusQueries } = require('../config.json')

const itemSchema = new mongoose.Schema({
    itemId: {
        type: String,
        unique: true
    },
    query: String,
    url: String,
    title: {
        type: String,
        validator: (v) => {
            var re = new RegExp(gpusQueries.join('|'))
            return re.test(v)
        }
    },
    image: String,
    type: String,
    conditions: String,
    price: Number,
    shippingCost: Number,
    location: String,
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('items', itemSchema, 'items')