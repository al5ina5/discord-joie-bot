require('dotenv').config()
const Discord = require('discord.js')
const fs = require('fs')

// Create a Discord.Client() instance.
const client = new Discord.Client()

// Load all commands into the client's commands object from the /commands/ folder.
client.commands = {}
client.aliases = {}
fs.readdir('./commands', (err, files) => {
    try {
        files.forEach(file => {
            var prop = require(`./commands/${file}`)
            var filename = file.split('.')[0];
            client.commands[filename] = prop;
            // if command has aliases
            if (prop.aliases) {
                for (alias of prop.aliases) {
                    // add alias to object
                    client.aliases[alias.toString()] = client.commands[filename] = prop; 
                }
                // add command to object
                client.aliases[filename] = client.commands[filename] = prop;
            }
        })
    } catch (err) {
        console.log(err)
    }
})

// Load all commands into the client's events object from the /events/ folder.
client.events = {}
fs.readdir('./events', (err, files) => {
    try {
        files.forEach(file => {
            var eventName = file.split('.')[0]
            var prop = require(`./events/${file}`)

            client.events[eventName] = prop
            client.on(eventName, prop.bind(null, client))
        })
    } catch (err) {
        console.log(err)
    }
})

// Initiate the connection with Discord using the token located in the client's settings object.
client.login(process.env.BOT_TOKEN)

// Catch and report discord.js errors.
client.on('error', (err) => console.error(err))
client.on('warn', (err) => console.warn(err))
// client.on('debug', (err) => console.info(err))

// Catch and report UnhandledPromiseRejectionWarnings.
process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error))
module.exports = client
