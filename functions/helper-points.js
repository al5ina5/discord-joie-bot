const Discord = require('discord.js')
const db = require('../mongo')

function grantPoints(mention) {
    db.UserModel.findOne({
        discord_id: mention.id
    }, function (error, user) {
        if (error) throw error

        if (user) {
            db.UserModel.updateOne({ discord_id: mention.id }, {
                points: user.points + 1
            }, (error) => {
                if (error) throw error
            })
            
        } else {
            const user = new db.UserModel({
                discord_id: mention.id
            })

            user.save()
        }
    })
}

exports.run = (client, message) => {
    var thanksRegex = /(^| )t(hank(s)?|hx|y)+/gi

    if (thanksRegex.test(message.content) && message.mentions.users.size) {
        message.mentions.users.map((mention, index) => {
            if (mention == message.author) {
                message.channel.send(`${mention}, did you really just thank yourself? Good try, but no points for you silly human. >:(`)
            } else {
                // grantPoints(mention)

                var embed = new Discord.MessageEmbed()
                    .setDescription(`Do you want to grant ${mention} a helper point?`)

                message.channel.send(embed).then(sentEmbed => {
                    sentEmbed.react('👍')
                    sentEmbed.react('👎')

                    const filter = (reaction, user) => {
                        return user.id === message.author.id
                    }
                    const collector = sentEmbed.createReactionCollector(filter, {
                        time: 30000
                    })

                    collector.on('collect', collected => {
                        if (collected.emoji.name === '👍') {

                            var embed = new Discord.MessageEmbed()
                                .setDescription(`${mention} has been granted a helper point for being helpful!`)
                                .setFooter(`Pro-tip: Use ${process.env.BOT_PREFIX}points to check your points.`, client.user.avatarURL());

                            sentEmbed.edit(embed)
                            grantPoints(mention)
                        }

                        collector.stop()
                    })

                    // collector.on('end', (collected) => {
                    //     if (!collected.size) {
                    //         message.channel.send('done.')
                    //     }
                    // })
                })

            }
        })
    }
}