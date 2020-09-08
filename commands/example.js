exports.run = (client, message, args) => {

    // your function

    message.channel.send(`This is an example command! You can run this command with ${process.env.BOT_PREFIX}example, ${process.env.BOT_PREFIX}test, or ${process.env.BOT_PREFIX}admin!`)
}

exports.help = 'Just an example command. Usage: `${process.env.BOT_PREFIX}example`'
exports.aliases = ['test', 'admin']