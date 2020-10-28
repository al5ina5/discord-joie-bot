const userService = require('../services/service-user')
const countries = require('../functions/helper-country')
const command = require('../functions/helper-command')
const db = require('../mongo')
const Discord = require('discord.js')

exports.run = async (client, message, args) => {
    let arg1 = command.getFirstOption(args);

    let option;
    for (i = 0; i < countryCommand.options.length; i++) {
        if (countryCommand.options[i].aliases.find(alias => countryCommand.optPrefix + alias === arg1)) {
            option = countryCommand.options[i]
            break
        }
    }
    if (option) option.handler(message, args, client, countryCommand)
    else handleEmpty(message, args, client, countryCommand)
}

const handleEmpty = (message, args, client, ecommand) => {
    if (args.length > 1) {
        let discordUser = message.mentions.users.first();
        if (discordUser)
            handleFrom(message, args, client);
        else
            handleWho(message, args, client);
    }
    else {
        handleHelp(message, args, client, ecommand);
    }
}

const handleHelp = (message, args, client, ecommand) => {
    command.sendHelp(message, ecommand);
}

const handleSet = (message, args, client) => {

    var country = args[args.length - 1];
    var discordUser = message.mentions.users.first() || message.author;
    var countryObj = countries.get(country);

    //message.guild.roles.cache.forEach(role => console.log(role.name, role.id));
    let mention = message.mentions.users.first()
    if(mention)
    {
        //gotta be a better way than using strings like this
        if (message.member.roles.cache.some(role => role.name === 'admin' || role.name === 'community contributor'  )) {
            discordUser = mention;
        }else
        {
            command.alert(message, `You don't have the permission to set another user's country.`)
            return;
        }
    }

    if (countryObj) {
        userService.setCountry(discordUser.id, countryObj, (user) => {
            if (user)
                command.embedMessage(message, [`Country set to ${countryObj.code} (${countries.getFlag(countryObj)} ${countryObj.name}) for ${discordUser.username}!`])
            else
                command.embedMessage(message, [`Who?`])
        });
    } else command.embedMessage(message, [`Never heard of that country. Sorry.`])
}

const handleWho = (message, args, client) => {
    var country = args[args.length - 1];
    var countryObj = countries.get(country);
    if (countryObj) {
        let names = [];
        userService.getByCountry(countryObj.code, async (users) => {
            await users.forEach(async element => {
                await client.users.fetch(element.discord_id).then((user) => {
                    names.push(`@${user.username}`)
                })
            });
            if (names.length > 0)
                command.embedMessage(message, [`The following devs are from ${countryObj.name} ${countries.getFlag(countryObj)}: ${names.join(', ')}`]);
            else
                command.embedMessage(message, [`No one is from ${countryObj.name} ${countries.getFlag(countryObj)}, maybe you should invite someone from that country! `]);
        });
    } else command.embedMessage(message, [`Never heard of that country. Sorry.`]);
}

const handleFrom = (message, args, client) => {
    let discordUser = message.mentions.users.first()
    userService.getById(discordUser.id, (user) => {
        let countryObj = countries.get(user.country);
        command.embedMessage(message, [`${discordUser.username} is from ${countryObj.name} ${countries.getFlag(countryObj)}`]);
    })
}

const handleStat = async (message, args, client) => {
    var countryCount = await db.UserModel.aggregate([
        {
            $group: {
                _id: '$country',
                points: { $sum: 1 }
            }
        }, { "$sort": { "points": -1 } },
    ])

    let embed = new Discord.MessageEmbed().setTitle("Where are the devs from?")
    if (countryCount.length === 0) {
        embed.setColor("RED");
        embed.addField("There seems to be no users here :(")
    } else {
        embed.setColor("BLUE");

        //create new earth object because the count is excludes all users that aren't in the db
        let earthI = countryCount.findIndex(x => x._id == "EARTH")
        let earthObj = { _id: "EARTH", points: message.guild.members.cache.size }
        if (earthI != -1) {
            countryCount.splice(earthI, 1);
        }

        var totalAssigned = countryCount.reduce(function (prev, cur) {
            return prev + cur.points;
        }, 0);

        earthObj.points = earthObj.points - totalAssigned;
        countryCount.push(earthObj);

        for (i = 0; i < countryCount.length; i++) {
            var country = countries.get(countryCount[i]._id);
            embed.addField(`${i + 1}. ${countries.getFlag(country)} ${country.name}`, `**Members**: ${countryCount[i].points}`);
        }
    }

    message.channel.send(embed);
}


let countryCommand = {
    commandName: 'country',
    optPrefix: '+',
    options: [{
        aliases: [''],
        description: "If {mention}, will let you know where the user is from. If {country}, will return a list of users from said country.",
        params: '{mention | country string | country code} ',
        supportSpaces: true,
        handler: handleEmpty
    },
    {
        aliases: ['help', 'halp'],
        description: "Will return a list of possible commands.",
        hide: true,
        params: '',
        handler: handleHelp
    },
    {
        aliases: ['whofrom'],
        description: "Will let you know where the user is from.",
        hide: true,
        params: '{country string | country code}',
        supportSpaces: true,
        handler: handleWho
    },
    {
        aliases: ['fromwhere'],
        description: "Will return a list of users from given country.",
        hide: true,
        params: '[mention]',
        handler: handleFrom
    },
    {
        aliases: ['stats', 'lb', 'stat', 'geolb', 'geo', 'glb'],
        description: "Will displays a list of countries where the members come from.",
        params: '',
        handler: handleStat
    },
    {
        aliases: ['set', 'setctry'],
        description: "Use this command to define the country you're from!",
        params: '{country string | country code}',
        supportSpaces: true,
        handler: handleSet
    }]
}