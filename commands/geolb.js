const db = require('../mongo')
const Discord = require('discord.js')
const countries = require('../functions/helper-country')

exports.run = async (client, message, args) => {
    var countryCount = await db.UserModel.aggregate([
        {
            $group: {
               _id: '$country',
               points: {$sum: 1}
            } 
        },{ "$sort": { "points": -1 } },
    ])
    
    let embed = new Discord.MessageEmbed().setTitle("Where are the members from?")

      if (countryCount.length === 0) {
        embed.setColor("RED");
        embed.addField("There seems to be no members here :(")
      } else {
        embed.setColor("BLUE");
        for (i = 0; i < countryCount.length; i++) {
            var country = countries.get(countryCount[i]._id); 
            embed.addField(`${i + 1}. :flag_${country.code.toLowerCase()}: ${country.name}`, `**Members**: ${countryCount[i].points}`);      
        }
      }
  
      message.channel.send(embed);   
}
exports.help = "Displays a list of countries where the members come from."
exports.aliases = ["glb"]  