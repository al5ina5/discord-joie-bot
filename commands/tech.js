const userService = require('../services/service-user')
const techService = require('../services/service-tech')
const countries = require('../functions/helper-country')
const command = require('../functions/helper-command')
const db = require('../mongo')
const Discord = require('discord.js')

exports.run = command.buildRunner(techCommands)

const handleHelp = command.handleHelp

const handleAdd = async (message, args, client) => {
    const discordUser = message.author
    const mentionedUser = message.mentions.users.first()
    let technology = args[args.length - 1]
    var user = await db.UserModel.findOne({ discord_id: discordUser.id })
    if (user.techStack.includes(technology.toLowerCase())) {
        embed.setColor('RED')
        embed.setDescription(`${technology} is already on your tech stack`)
        message.channel.send(embed)
        return
    }
    if (!user) {
        user = new db.UserModel({
            discord_id: discordUser.id,
            points: 0,
            techStack: [technology]
        })
        await user.save()
    }

    let embed = new Discord.MessageEmbed()

    if (technology === '+add' || technology === '+save') {
        embed.setColor('RED')
        embed.setDescription('No params given to add :(')
        message.channel.send(embed)
        return
    }
    if (mentionedUser) {
        embed.setColor('RED')
        embed.setDescription("You cannot add technologies to someone else's tech stack :)")
        message.channel.send(embed)
        return
    }

    await techService.addTechnology(discordUser.id, technology)
    embed.setColor('BLURPLE')
    technology = technology.charAt(0).toUpperCase() + technology.slice(1)
    embed.setDescription(`${technology} is added to your tech stack.`)
    message.channel.send(embed)
}

const handleSelf = async (message, args, client) => {
    const discordUser = message.author
    const user = await techService.getById(discordUser.id)
    let des = ''
    let embed = new Discord.MessageEmbed().setTitle(` @${message.author.tag} 's Stack`)
    const stack = user.techStack
    if (stack === []) {
        embed.setColor('RED')
        embed.addField('Your tech stack is empty... :(')
    } else {
        embed.setColor('BLURPLE')
        stack.forEach((technology) => {
            if (technology != null) {
                technology = technology.charAt(0).toUpperCase() + technology.slice(1)
            }
            des += technology
            des += `\n`
        })
        embed.setDescription(`**${des}**`)
    }
    message.channel.send(embed)
}

const handleSearch = async (message, args, client) => {
    const discordUser = message.mentions.users.first()
    if (discordUser) {
        const user = await techService.getById(discordUser.id)
        let des = ''
        let embed = new Discord.MessageEmbed().setTitle(`@${discordUser.tag}'s Stack`)
        const stack = user.techStack
        console.log(user.techStack)
        if (user.techStack.length === 0) {
            embed.setColor('RED')
            embed.setTitle(`${discordUser.username} seems to have no technologies in their stack.`)
            message.channel.send(embed)
            return
        } else {
            embed.setColor('BLURPLE')
            stack.forEach((technology) => {
                if (technology != null) {
                    technology = technology.charAt(0).toUpperCase() + technology.slice(1)
                }
                des += technology
                des += `\n`
            })
            embed.setDescription(`**${des}**`)
        }
        message.channel.send(embed)
    } else {
        let embed = new Discord.MessageEmbed()
        let technology = args[args.length - 1]
        let des = ''
        if (technology === '+search' || technology === '+lookup') {
            embed.setColor('RED')
            embed.setTitle("Sorry, I can't search for nothing.")
        } else {
            embed.setColor('BLURPLE')
            embed.setTitle(`Humans with \`${technology}\` in their stack.`)
            const users = await db.UserModel.find({
                techStack: { $in: [technology.toLowerCase()] }
            })
            console.log(users)
            let index = 0
            users.forEach((user) => {
                let member = message.guild.members.cache.get(users[index].discord_id)
                des += `${member}`
                des += `\n`
                index += 1
            })
            embed.setDescription(des)
        }
        message.channel.send(embed)
    }
}
const handleDelete = async (message, args, client) => {
    const discordUser = message.author
    const user = await techService.getById(discordUser.id)

    const stack = user.techStack
    const embed = new Discord.MessageEmbed()
    let technology = args[args.length - 1]
    if (technology === '+delete' || technology === '+remove') {
        embed.setColor('RED')
        embed.setDescription('Did you just try to delete nothing from your tech stack you silly human :(')
        message.channel.send(embed)
        return
    } else if (!stack.includes(technology)) {
        embed.setColor('RED')
        embed.setDescription(`${technology} could not be deleted because it is not in your stack :(`)
        message.channel.send(embed)
        return
    }

    await db.UserModel.updateOne(
        { discord_id: discordUser.id },
        { $pullAll: { techStack: [technology.toLowerCase()] } }
    )
    embed.setColor('RED')
    technology = technology.charAt(0).toUpperCase() + technology.slice(1)
    embed.setDescription(`${technology} has been removed from your stack`)
    message.channel.send(embed)
}

let techCommands = {
    commandName: 'tech',
    optPrefix: '+',
    options: [
        {
            aliases: [''],
            description:
                'If {+search techName} will show you a list of devs which use the technology, If {+add techName} will add a technology to your tech stack,If {+delete techName} will delete a technology from your tech stack.',
            params: '{techName}',
            supportSpaces: false,
            handler: command.handleEmpty
        },
        {
            aliases: ['help', 'halp'],
            description: 'Will return a list of possible commands.',
            hide: true,
            params: '',
            handler: handleHelp
        },
        {
            aliases: ['add', 'save'],
            description: 'Will add a new technology to your tech stack.',
            params: '{techName}',
            supportSpaces: true,
            handler: handleAdd
        },
        {
            aliases: ['self', 'me'],
            description: 'Will show your own tech stack.',
            params: '',
            supportSpaces: true,
            handler: handleSelf
        },
        {
            aliases: ['delete', 'remove'],
            description: 'Will delete a technology from your tech stack',
            params: '{techName}',
            handler: handleDelete
        },

        {
            aliases: ['search', 'lookup'],
            description:
                "Use this command to look for people having a particular technology in their stack or look up people's stacks",
            params: '{techName || user}',
            supportSpaces: true,
            handler: handleSearch
        }
    ]
}
