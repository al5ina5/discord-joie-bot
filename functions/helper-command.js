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
