const userService = require('../services/service-user')
const techService = require('../services/service-tech')
const countries = require('../functions/helper-country')
const command = require('../functions/helper-command')
const db = require('../mongo')
const Discord = require('discord.js')

exports.run = async (client, message, args) => {
    let arg1 = command.getFirstOption(args);

    let option;
    for (i = 0; i < techCommands.options.length; i++) {
        if (techCommands.options[i].aliases.find(alias => techCommands.optPrefix + alias === arg1)) {
            option = techCommands.options[i]
            break
        }
    }
    if (option) option.handler(message, args, client, techCommands)
    else handleEmpty(message, args, client, techCommands)
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

const handleAdd = async(message, args, client) => {
    const discordUser = message.author
    const mentionedUser = message.mentions.users.first()
    const user = await techService.getById(discordUser.id)
    let technology = args[args.length - 1];
    let embed = new Discord.MessageEmbed()

    if(technology === "+add" || technology ===  "+save"){
        embed.setColor("RED");
        embed.setDescription("Did you just try to add nothing to your tech stack you silly human :(")
        return;

    }
    if(mentionedUser){
        embed.setColor("RED");
        embed.setDescription("You cannot add technologies to someone else's tech stack :)")
        return;

    }

    if(user.techStack.includes(technology.toLowerCase())){

        embed.setColor("RED");
        embed.setDescription(`${technology} is already on your tech stack`)
        message.channel.send(embed)
        return;

    }   

   
    await techService.addTechnology(discordUser.id,technology)
    embed.setColor("BLURPLE");
    embed.setDescription(`${technology} is added to your tech stack.`)
    message.channel.send(embed)

}

const handleSelf = async (message,args,client) => {
    const discordUser = message.author
    const user = await techService.getById(discordUser.id)
    let des = ''
    let embed = new Discord.MessageEmbed()
        .setTitle(`<@${message.author.username}> 's Stack`)
    const stack = user.techStack
    if(stack === []){
        embed.setColor("RED")
        embed.addField("You seem to have no technologies in your stack")
    }else{
        embed.setColor("BLURPLE")
        stack.forEach((technology) => {
            if(technology != null){
                technology = technology.charAt(0).toUpperCase() + technology.slice(1)
            }
            des += technology
            des += `\n`

        })
        embed.setDescription(`**${des}**`)
    }
    message.channel.send(embed)
}

const handleSearch = async (message,args,client) => {
    const discordUser = message.mentions.users.first()
    if(discordUser){
        const user = await techService.getById(discordUser.id)
        let des = ''
        let embed = new Discord.MessageEmbed()
            .setTitle(`${discordUser.username}'s Stack`)
        const stack = user.techStack
        console.log(user.techStack)
        if(user.techStack.length === 0){
            embed.setColor("RED")
            embed.setTitle(`${discordUser.username} seems to have no technologies in his stack`)
            message.channel.send(embed)
            return ;
        }else{
            embed.setColor("BLURPLE")
            stack.forEach((technology) => {
                if(technology != null){
                    technology = technology.charAt(0).toUpperCase() + technology.slice(1)
                }
                des += technology
                des += `\n`

            })
            embed.setDescription(`**${des}**`)
        }
        message.channel.send(embed)
    }
    else{
        let embed = new Discord.MessageEmbed()
        let technology = args[args.length - 1];
        let des = ''
        if(technology === "+search" ||technology ===  "+lookup"){
            embed.setColor("RED")
            embed.setTitle("Sorry, I can't search for nothing.")
        }else{
            embed.setColor("BLURPLE")
            embed.setTitle(`People with ${technology} in their stack`)
            const users = await db.UserModel.find({techStack:{"$in":[technology.toLowerCase()]}})
            console.log(users)
            let index = 0
            users.forEach((user) => {
                let member = message.guild.members.cache.get(users[index].discord_id)
                des += `<@${user.discord_id}>`
                des += `\n`
                index += 1
            })
            embed.setDescription(des)
        }
        message.channel.send(embed)
    }
}
const handleDelete = async(message,args,client) => {
    const discordUser = message.author
    const user = await techService.getById(discordUser.id)

    const stack = user.techStack
    const embed = new Discord.MessageEmbed()
    let technology = args[args.length - 1];
    if(technology === "+delete" || technology === "+remove"){
        embed.setColor("RED");
        embed.setDescription("Did you just try to delete nothing from your tech stack you silly human :(")
        message.channel.send(embed)
        return;
    }else if(!stack.includes(technology)){
        embed.setColor("RED");
        embed.setDescription(`${technology} could not be deleted because it is not in your stack :(`)
        message.channel.send(embed)
        return;
    }

    await db.UserModel.updateOne( {discord_id: discordUser.id}, { $pullAll: {techStack: [technology.toLowerCase()] } } )
        embed.setColor("BLURPLE");
        embed.setDescription(`${technology} has been removed from your stack`)





}

let techCommands = {
    commandName: 'tech',
    optPrefix: '+',
    options: [{
        aliases: [''],
        description: "If {+search techName} will show you a list of devs which use the technology, If {+add techName} will add a technology to your tech stack,If {+delete techName} will delete a technology from your tech stack.",
        params: '{techName}',
        supportSpaces: false,
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
        aliases: ['add','save'],
        description: "Will add a new technology to your tech stack.",
        params: '{techName}',
        supportSpaces: true,
        handler: handleAdd
    },
    {
        aliases: ['self','me'],
        description: "Will show your own tech stack.",
        params: '',
        supportSpaces: true,
        handler: handleSelf
    },
    {
        aliases: ['delete','remove'],
        description: "Will delete a technology from your tech stack",
        params: '{techName}',
        handler: handleDelete
    },
    
    {
        aliases: ['search', 'lookup'],
        description: "Use this command to look for people having a particular technology in their stack or look up people's stacks",
        params: '{techName || user}',
        supportSpaces: true,
        handler: handleSearch
    }]
}