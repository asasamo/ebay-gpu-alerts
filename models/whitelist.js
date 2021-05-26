const mongoose = require('mongoose')

const whitelistSchema = new mongoose.Schema({
    chatId: {
        type: Number,
        unique: true,
        validate: {
            validator: function (v) {
                return v.length == 9
            },
            message: 'chatId non valido.'
        },
        required: true
    },
    isAdmin: {
            type: Boolean,
            default: false
    },
    username: String,
    joinDate: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('whitelist', whitelistSchema, 'whitelist')