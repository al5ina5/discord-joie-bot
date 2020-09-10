client.on('ready', () => {
    client.user.setStatus('online')
    client.user.setPresence({
        game: {
            name: `Use \`${process.env.BOT_PREFIX}commands for a list of commands!`,
            type: "WATCHING",
            url: "your url"
        }
    })
})