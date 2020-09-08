# Discord Bot Boilerplate
A boilerplate to quickly deploy a powerful Discord bots. Quickly and painlessly deploy a powerful, lightweight and extremely easy-to-manage Discord bot for both beginners and expert users. No experience needed.

# Features
- [x] 100% free and open source.
- [x] Fully customizable, host on your own server!
- [x] Quick deployment: Get the bot online in > 1 minute.
- [x] Extremely lightweight, less than 1MB.
- [x] Fully commented: Easy for a new developer to understand and navigate.
- [x] Powerful command handler.
- [x] Example commands to expand from.
- [x] Built in `!commands` and `!help` commands.
- [ ] Bloated, unnecessary, complex, or downright annoying features.
- [ ] Complex set-up.
- [ ] Premium or paid packages.

# How-to / Setup
Prerequisites:
- NodeJS installed on the machine.
- Your Discord bot's token.
- Your Discord bot invited to your server.
- A brain.

1. Download/clone the repo.
2. Duplicate `.env.sample` and rename it `.env`.
3. Place your Discord bot's token in `.env`.
4. Open a Terminal (Console) window, and navigate to your project by using `cd /path/to/this/repo`.
5. Run `npm i` to download the dependencies.
6. Run `node bot.js` to initiate the bot.

# Usage
This boilerplate features a quick and powerful commmand handler to dynamically load and manage each command. Commands are stored in the `/commands/` folder and have 3 main functions:
- `exports.run`: The main function of the command.
- `exports.help`: The descripion of the commands. Appears when a users runs `!commands [command]`.
- `exports.aliases`: The aliases of the command. A command can be run using it's main name or one of it's aliases. A good example is setting an alias of `!balance` to `!bal` so that both commands do the same thing.

### Example Command
`/commands/examples.js`
```javascript
exports.run = (client, message, args) => {

    // your function

    message.channel.send('This is an example command!')
    console.log('You can run this command with !example, !test, or !admin!')
}

exports.help = 'Just an example command. Usage: `!example`'
exports.aliases = ['test', 'admin']
```

Upon running a command in the Discord chat, the command handler will intelligently find the command's `.js` file in the `/commands/` folder and run the `exports.run` function located within it.

### Working with the Command Handler
The boilerplate features 2 exports that are extremely useful in dynamically managing your bot's commands:
- `client.settings`: An object that contains all the information in the `bot-setings.json`. For example, you can quickly find the bot's prefix by using `bot.settings.prefix`.
- `client.commands`: An object that contains all the information and functions for every command. For example, you can pull the help information on a command by using `bot.commands['command-name'].help`.

This makes it really easy to manage the commands on a global level. To access the bot's scopes from your `.js` file on a global scale, you'll need to import it using a  `require` somewhere near the top.

```javascript
const client = require('./client.js')
```

A good example of this in use is the `!commands` command, which lists all the available commands the bot has loaded.

```javascript
exports.run = (client, message, args) => {
    console.log(client.commands)

    message.channel.send(
        `Commands: \`${process.env.BOT_PREFIX}` +
        Object.keys(client.commands).join(`\`, \`${process.env.BOT_PREFIX}`) + '`'
    )
}

exports.help = 'Displays a list of available commands.'
exports.aliases = ['commandlist', 'command']
```
> Commands: !commands, !example, !help

# FAQ
**How can I change the bot's prefix?**
- The prefix is defined in the `.env` file.

**Does this bot moderation feature commands like `!purge`, `!kick`, and `!ban`?**
- It does not. This is boilerplate for developers to develop their own commands for their Discord server—not quite a moderation/utility bot.

**How can I host my bot when I'm away from my machine, 24/7?**
- For that, you'll need to run the program on a remote machine. You'll need a VPS of your own. [You can get a VPS for less than $10/month on https://bugplay.com!](https://bugplay.com)

**Where can I donate?**
- You can support [UNDERFORUMS on Patreon](https://www.patreon.com/underforums), send tips to my Bitcoin address (`3HFuhH4enDUKFqokiron6jyMSzPVwNHkTW`), or send me [XLM on Keybase (@youngseebi)](https://keybase.io/youngseebi)!

**Can you develop a bot for me?**
- I'd love to! Reach out to me if you'd like to hire me.