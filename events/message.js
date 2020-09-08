module.exports = (client, message) => {
    if (message.author.bot) return
    if (!message.content.startsWith(process.env.BOT_PREFIX)) return
    
    var cmd = message.content.toLowerCase().trim()
    var args = cmd.split(' ')

    try {
        for (var i in client.commands) {
            if (cmd.startsWith(process.env.BOT_PREFIX + i)) {
                client.commands[i].run(client, message, args)
                break
            } else {
                if (client.commands[i].aliases) {
                    if (client.commands[i].aliases.includes(args[0].split(process.env.BOT_PREFIX)[1])) {
                        client.commands[i].run(client, message, args)
                        break
                    }
                }
            }
        }
    } catch (err) {
        console.log(err)
    }
}