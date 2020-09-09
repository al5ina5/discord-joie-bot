const db = require('../mongo')

exports.run = async (client, message, args) => {
    var mention = message.mentions.users.first()
    if (!mention) {
        db.UserModel.findOne({ discord_id: message.author.id }, (error, user) => {
            if (error) throw error
            console.log(user)
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

exports.help = 'Just an example command. Usage: `${process.env.BOT_PREFIX}example`'
exports.aliases = ['test', 'admin']