const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    itemId: {
        type: String,
        unique: true
    },
    url: String,
    title: String,
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