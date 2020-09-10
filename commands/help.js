exports.run = (client, message, args) => {
    var searched = args[1]

    // If nothing is searched...
    if (!searched) {
        message.channel.send(`Use \`${process.env.BOT_PREFIX}commands\` to view a list of commands. Use \`${process.env.BOT_PREFIX}help [command]\` to view more information on a specific command.`)
        return
    }

    // If the search contains the prefix...
    if (searched.includes(process.env.BOT_PREFIX)) {
        console.log('has prefix')
        searched = searched.split(process.env.BOT_PREFIX)[1]
    }

    // If the command doesn't exist...
    if (!Object.keys(client.commands).includes(searched.toLowerCase())) {
        message.channel.send(`Sorry, but I don't think that command exists. Use \`${process.env.BOT_PREFIX}commands\` for a list of commands.`)
        return
    }

    // If the command doesn't have any help information set...
    if (!client.commands[searched].help) {
        message.channel.send(`Sorry, but I don't have information on that command.`)
        return
    }

    message.channel.send(client.commands[searched].help)
    // message.channel.send(`\`${process.env.BOT_PREFIX}${searched}\` — ${client.commands[searched].help}`)
}

exports.help = 'Displays more information on a specific command.'
exports.aliases = ['details']