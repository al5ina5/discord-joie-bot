exports.run = (client, message, args) => {
    console.log(client.commands)
    
    message.channel.send(
        `Commands: \`${process.env.BOT_PREFIX}` +
        Object.keys(client.commands).join(`\`, \`${process.env.BOT_PREFIX}`) + '`'
    )
}

exports.help = 'Displays a list of available commands.'
exports.aliases = ['commandlist', 'command']