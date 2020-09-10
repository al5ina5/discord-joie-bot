const userService = require('../services/service-user')
const countries = require('../functions/helper-country')
const command = require('../functions/helper-command')
const db = require('../mongo')
const Discord = require('discord.js')

exports.run = async (client, message, args) => {
    let arg1 = command.getFirstOption(args);
    let option;
    for (i = 0; i < countryCommand.options.length; i++)
    {
        if(countryCommand.options[i].aliases.find(alias => countryCommand.optPrefix + alias === arg1))
        {
            option = countryCommand.options[i]
            break
        }
    }
    if(option) option.handler(message, args)
    else handleEmpty(message, args, countryCommand)
}
 
const handleEmpty = (message, args, ecommand) => {
    if(args.length > 1){
        let discordUser = message.mentions.users.first();
        if (discordUser)
            handleFrom(message, args);
        else
            handleSet(message, args);
    }
    else{
        handleHelp(message, ecommand);
    }
}

const handleHelp  = (message, ecommand) => {
    command.sendHelp(message, ecommand);
}

const handleSet   = (message, args) => {
    var country = args[args.length - 1];
    var discordUser = message.mentions.users.first() || message.author;
    var countryObj = countries.get(country);

    if(countryObj){
        userService.setCountry(discordUser.id, countryObj ,(user)=>{
            if (user)   
                command.embedMessage(message, [`Country set to ${countryObj.code} (${countries.getFlag(countryObj)} ${countryObj.name}) for ${discordUser.username}!`])
            else 
                command.embedMessage(message, [`Who?`])
        });
    }else command.embedMessage(message, [`Never heard of that country. Sorry.`])
}

const handleWho   = (message, args) => {
    command.notYetImplemented(message);
}

const handleFrom  = (message, args) => {
    let discordUser = message.mentions.users.first()
    userService.getById(discordUser.id, (user) =>{
        let countryObj = countries.get(user.country);
        command.embedMessage(message, [`${discordUser.username} is from ${countryObj.name} ${countries.getFlag(countryObj)}`]);
    })
}

const handleList  = (message, args) => {
    command.notYetImplemented(message);
}

const handleStat  = async (message, args) => {
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
            embed.addField(`${i + 1}. ${countries.getFlag(country)} ${country.name}`, `**Members**: ${countryCount[i].points}`);      
        }
      }
  
      message.channel.send(embed);   
}


let countryCommand = {
    commandName: 'country',
    optPrefix: '-',
    options: [{
         aliases: [''],
         description: "If {mention}, will let you know where the user is from. If {country}, will return a list of users from said country.",
         params: '{mention | country string | country code | flag emoji} ',
         supportSpaces: true,
         handler: handleEmpty
     },
     {
         aliases: ['help', 'halp'],
         description: "Will return a list of possible commands.",
         params: '',
         handler: handleHelp
     },
     {
         aliases: ['whofrom'],
         description: "Will let you know where the user is from.",
         params: '{country string | country code | flag emoji}',
         supportSpaces: true,
         handler: handleWho
     },
     {
         aliases: ['fromwhere'],
         description: "Will return a list of users from given country.",
         params: '[mention]',
         handler: handleFrom
     },
     {
         aliases: ['stats', 'lb', 'stat', 'geolb', 'geo'],
         description: "Will return a board with a sum of members per country.",
         params: '',
         handler: handleStat
     },
     {
         aliases: ['list', 'ls'],
         description: "Will return a list of countries and codes.",
         params: '',
         handler: handleList
     },
     {
         aliases: ['set'],
         description: "Will set your country.",
         params: '{country string | country code | flag emoji}',
         supportSpaces: true,
         handler: handleSet
     }]
 }