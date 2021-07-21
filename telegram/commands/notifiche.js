const whitelistSchema = require('../../models/whitelist')
const commandInfo = require('../../models/commands/info')

module.exports.run = async (ctx) => {
    var args = ctx.message.text.split(' ') || ['']

    const ADMIN = await whitelistSchema.findOne({ isAdmin: true })
    switch (args[1]) {
        case 'on':
            new whitelistSchema({ chatId: args[2], username: args[3] }).save(async err => {
                if (err) {
                    ctx.reply('Errore: ' + err.message)
                } else {
                    ctx.reply('Utente aggiunto correttamente!')
                }
            })
            break

        case 'off':
            whitelistSchema.deleteOne({ chatId: args[2] }).then(err => {
                if (err) {
                    ctx.reply('Errore: ' + err.message)
                } else {
                    ctx.reply('Utente eliminato con successo!')
                }
            })
            break

        default:
            ctx.reply(commandInfo(config.command, config.arguments.options, config.arguments.states))
            break
    }
}

const config = exports.config = {
    command: 'notifiche',
    description: 'Attiva o disativa le notifiche in questa chat.',
    arguments: {
        options: ['on', 'off', 'verifica'],
        states: []
    }
}