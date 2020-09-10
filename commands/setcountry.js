const userService = require('../services/service-user')
const countries   = require('../functions/helper-country')

exports.run = async (client, message, args) => {
    var country = args[args.length - 1];
    var discordUser = message.mentions.users.first() ?? message.author;
    var countryObj = countries.get(country);

    if(countryObj){
        userService.setCountry(discordUser.id, countryObj ,(user)=>{
            if (user)   
                message.channel.send(`Country set to ${countryObj.code} (:flag_${countryObj.code.toLowerCase()}: ${countryObj.name}) for ${discordUser.username}!`)
            else 
                message.channel.send(`Who?`)
        });
    }else message.channel.send(`Never heard of that country. Sorry.`)
}