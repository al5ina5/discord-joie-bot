module.exports = (client) => {
    console.log(`Logged in as ${client.user.tag}!`)
    console.log(`Commands loaded: ${process.env.BOT_PREFIX}${Object.keys(client.commands).join(`, ${process.env.BOT_PREFIX}`)}`)
    console.log(`Events loaded: ${Object.keys(client.events).join(`, `)}`)
}