const db = require('../mongo')

exports.run = async (client, message, args) => {
    let role = message.guild.roles.find(r => r.name === "Helpful Angel");
    var mention = message.mentions.users.first()
    if (!mention) {
        await db.UserModel.findOne({ discord_id: message.author.id }, (error, user) => {
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
        if(user.points === 4){
            mention.roles.add(role)
            console.log(mentions.roles)
        }
    }
}

exports.help = "Check how many helper points you've been granted."
exports.aliases = ['pts']