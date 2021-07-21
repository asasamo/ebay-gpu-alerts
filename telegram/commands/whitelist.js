const { Telegraf } = require('telegraf')
const moment = require('moment')
const whitelistSchema = require('../../models/whitelist')

/* Yet to find a solution
async function getUsername(ctx, chatId) {

}
*/

module.exports.run = async (ctx) => {
    var args = ctx.message.text.split(' ') || ['']

    const ADMIN = await whitelistSchema.findOne({ isAdmin: true })
    if (ctx.chat.id === ADMIN.chatId) {
        switch (args[1]) {
            case 'add':
                new whitelistSchema({ chatId: args[2], username: args[3] }).save(async err => {
                    if (err) {
                        ctx.reply('Errore: ' + err.message)
                    } else {
                        ctx.reply('Utente aggiunto correttamente!')
                    }
                })
                break

            case 'remove':
                whitelistSchema.deleteOne({ chatId: args[2] }).then(err => {
                    if (err) {
                        ctx.reply('Errore: ' + err.message)
                    } else {
                        ctx.reply('Utente eliminato con successo!')
                    }
                })
                break

            case 'list':
                var users = await whitelistSchema.find({})

                var chatIds = []
                users.forEach((user) => {
                    chatIds.push(` - "${user.chatId}" - ${user.username ? user.username : 'non specificato'} - ${moment(user.joinDate).format('HH:mm DD/MM/YYYY')}`)
                })
                ctx.reply(`Utenti registrati:\n${chatIds.join('\n')}`)
                break

            default:
                ctx.reply('Utilizzo: /whitelist [list/add/remove] <chatId> <username>')
                break
        }
    } else {
        ctx.reply('Non hai accesso a questo comando!')
    }
}

const config = exports.config = {
    command: 'whitelist',
    description: 'Configurazione whitelist.',
    arguments: {
        options: ['add', 'remove', 'list'],
        states: ['chatId']
    }
}