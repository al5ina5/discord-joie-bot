const db = require('../mongo')
const Discord = require('discord.js')
const client = require('../bot')


exports.run = async (client, message, args) => {
    var users = await db.UserModel.find({}).sort([['points',-1]])
    let embed = new Discord.MessageEmbed()
        .setTitle("Helpers Leaderboard")
      //if there are no results
      if (users.length === 0) {
        embed.setColor("RED");
        embed.addField("There seems to be no helpers here :(")
      } else if (users.length < 10) {
        //less than 10 results
        embed.setColor("BLUE");
        for (i = 0; i < users.length; i++) {
          let member = message.guild.members.cache.get(users[i].discord_id) || "User Left"
          if (member === "User Left") {
            embed.addField(`${i + 1}. ${member}`, `**Points**: ${users[i].points}`);
          } else {
            embed.addField(`${i + 1}. ${member.user.username}`, `**Points**: ${users[i].points}`);
          }
        }
      } else {
        //more than 10 results
        embed.setColor("BLURPLE");
        for (i = 0; i < 10; i++) {
          let member = message.guild.members.get(users[i].points) || "User Left"
          if (member === "User Left") {
            embed.addField(`${i + 1}. ${member}`, `**Points**: ${users[i].points}`);
          } else {
            embed.addField(`${i + 1}. ${member.user.username}`, `**Points**: ${users[i].points}`);
          }
        }
      }
  
      message.channel.send(embed);
    

    
}

exports.help = 'Displays more information on a specific command.'
exports.aliases = ['details']