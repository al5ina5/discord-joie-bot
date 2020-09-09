const db = require('../mongo')

exports.run = (client, message, args) => {
    db.UserModel.findOne({ discord_id: message.author.id }, (error, user) => {
        if (error) throw error

        console.log(user)
        if (user) {
            message.channel.send(`You currently have ${user.points} helper point(s).`)
        } else {
            message.channel.send(`You currently have 0 points.`)
        }
    })
}

exports.help = 'Just an example command. Usage: `${process.env.BOT_PREFIX}example`'
exports.aliases = ['test', 'admin']