const Discord = require('discord.js')

exports.getFirstOption = (args) => {
    return (args.length > 1?args[1]:'').toLowerCase()
}

exports.notYetImplemented = (message) => {
    let embed = new Discord.MessageEmbed()
    embed.setColor("RED");
    embed.setDescription(`:construction: Not implemented yet. Sorry.`);      
    message.channel.send(embed);   
}
exports.alert = (message, msg) => {
    let embed = new Discord.MessageEmbed()
    embed.setColor("RED");
    embed.setDescription(`:rotating_light: ${msg}`);      
    message.channel.send(embed);   
}

exports.embedMessage = (message, text) => {
    let embed = new Discord.MessageEmbed()
    embed.setColor("BLUE");
    for (i = 0; i < text.length; i++) {
        embed.setDescription(text[i]);      
    }   
    message.channel.send(embed);   
}

exports.sendHelp = (message, commandObj) => {
    let embed = new Discord.MessageEmbed()
    embed.setTitle(':desktop: Command Helper');
    embed.setColor("BLUE");
    let commandHead = process.env.BOT_PREFIX + commandObj.commandName
    for (i = 0; i < commandObj.options.length; i++) { 
        
        option = commandObj.options[i];
        if(option.hide)
            continue;
        
        alias =  option.aliases[0];
        if(alias == '')
        {
            embed.addField(`${commandHead} ${option.params}`, option.description);      
        }else
            embed.addField(`${commandHead} ${commandObj.optPrefix + option.aliases[0]} ${option.params}`, option.description);
    }   
    message.channel.send(embed);   
}

exports.buildRunner = config => async (client, message, args) => {
    let arg1 = exports.getFirstOption(args)

    let option
    for (i = 0; i < config.options.length; i++) {
        if (config.options[i].aliases.find((alias) => config.optPrefix + alias === arg1)) {
            option = config.options[i]
            break
        }
    }
    if (option) option.handler(message, args, client, config)
    else handleEmpty(message, args, client, config)
}

exports.handleEmpty = (message, args, client, ecommand) => {
    if (args.length > 1) {
        let discordUser = message.mentions.users.first()
        if (discordUser) handleFrom(message, args, client)
        else handleWho(message, args, client)
    } else {
        handleEmpty(message, args, client, ecommand)
    }
}

exports.buildHelp = config => (message, args, client, ecommand) => {
    exports.sendHelp(message, config)
}