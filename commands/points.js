const db = require('../mongo')

exports.run = async (client, message, args) => {
    var mention = message.mentions.users.first()
    if (!mention) {
        db.UserModel.findOne({ discord_id: message.author.id }, (error, user) => {
            if (error) throw error
            if (user) {
                message.channel.send(`You currently have ${user.points} helper point(s).`)
            } else {
                message.channel.send(`You currently have 0 points.`)
            }
        })
    } else {
        var user = await db.UserModel.findOne({ discord_id: mention.id })
        if (user) {
            message.channel.send(`${mention} currently has ${user.points} helper point(s).`)
        } else {
            message.channel.send(`${mention} currently has 0 helper point(s).`)
        }
    }
}

exports.help = 'Displays a users helper points.'
exports.aliases = ['test', 'admin']