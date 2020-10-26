const Discord = require('discord.js')
const db = require('../mongo')

function congratulate(mention,role,message){
    var embed = new Discord.MessageEmbed()
                    .setDescription(`Congrats! ${mention} has been granted ${role} role for being helpful.`)
    message.channel.send(embed)                
}

async function grantPoints(mention,message){
    const member = message.mentions.members.first();
    let helpful_webmeister = await message.guild.roles.cache.find(r => r.name === "Helpful Webmeister");
    let helpful_angel = await message.guild.roles.cache.find(r => r.name === "Helpful Angel");
    let helpful_web_master = await message.guild.roles.cache.find(r => r.name === "Helpful Web Master");
    let helpful_web_deity = await message.guild.roles.cache.find(r => r.name === "Helpful Web Deity");

    await db.UserModel.findOne({
        discord_id: mention.id
    },async function (error, user) {
        if (error) throw error
        if (user) {
            await db.UserModel.updateOne({ discord_id: mention.id }, {
                points: user.points + 1
            }, (error) => {
                if (error) throw error
            })
            switch(user.points){
                case 9:
                    member.roles.add(helpful_webmeister)
                    congratulate(member,helpful_webmeister,message)
                    break
                case 24:
                    member.roles.add(helpful_angel)  
                    congratulate(member,helpful_angel,message)
                    break  
                case 49:
                    member.roles.add(helpful_web_master)    
                    congratulate(member,helpful_web_master,message)
                    break
                case 99:
                    member.roles.add(helpful_web_deity)    
                    congratulate(member,helpful_web_deity,message)
                    break

                    
            }

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
                            grantPoints(mention,message)
                        }

                        collector.stop()
                    })

                    collector.on('end', collected => {
                        setTimeout(() => {
                            sentEmbed.delete()
                        }, 3000)
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