# Discord Bot Boilerplate

A boilerplate to quickly deploy a powerful Discord bots. Quickly and painlessly deploy a powerful, lightweight and extremely easy-to-manage Discord bot for both beginners and expert users. No experience needed.

# Features

- [x] 100% free and open source.
- [x] Fully customizable, host on your own server!
- [x] Quick deployment: Get the bot online in > 1 minute.
- [x] Extremely lightweight, less than 1MB.
- [x] Fully commented: Easy for a new developer to understand and navigate.
- [x] Powerful command handler.
- [x] Built in `!commands` and `!help` commands.
- [x] Grant helper points to helpful people.
- [x] Manage a helper leaderboard
- [x] Tracks which country people are from.
- [x] Provides an aggregate for countries.
- [x] Keeps track of people's tech stack
- [x] Allows search of people by what technology they use.
- [x] Allows search of people's tech stack.

# How-to / Setup

Prerequisites:

- NodeJS installed on the machine.
- Mongodb
  - Installed locally. [Guide here](https://docs.mongodb.com/manual/installation/)
  - Or you can use free tier from [mlab](https://mlab.com/) or [mongodb](https://www.mongodb.com/cloud) itself.
- Your Discord bot's token. (Create Discord bot [here](https://discord.com/developers/applications))
- Your Discord bot invited to your server.
- A brain. 🧠

## Steps to start coding 🚀

### Fork the repository by clicking `Fork` button at top of this page.

### Clone your repository.

```bash
git clone git@github.com:YOUR_USER:YOUR_FORK.git
```

### Open a terminal, and navigate to your project.

```bash
cd YOUR_FORK
```

### Copy `.env.example` file.

```bash
cp .env.example .env
```

### Setup your environment variables in `.env` file.

### Install npm dependencies

```bash
npm install
```

### Start Coding 👨‍💻👩‍💻

```bash
npm run dev
```

# FAQ

**How can I change the bot's prefix?**

- The prefix is defined in the `.env` file.

**How I can start contributing?**

- Fork the project
- Follow [How-to / Setup](#how-to--setup) to prepare everything you need
- You are ready!

**How I can use local mongodb ???**

- Your local mongodb url will most likely look like this:
  "`mongodb://127.0.0.1:27017/joie`". Where `27017` is default mongodb port and `joie` is your database name.

**Does this bot moderation feature commands like `!purge`, `!kick`, and `!ban`?**

- It does not. This is not quite a moderation/utility bot.

**How can I host my bot when I'm away from my machine, 24/7?**

- For that, you'll need to run the program on a remote machine. You'll need a VPS of your own. [You can get a VPS for less than \$10/month on https://revolt.host/!](https://revolt.host/)

**Where can I donate?**

- You can support [UNDERFORUMS on Patreon](https://www.patreon.com/underforums), send tips to my Bitcoin address (`3HFuhH4enDUKFqokiron6jyMSzPVwNHkTW`), or send me [XLM on Keybase (@youngseebi)](https://keybase.io/youngseebi)!

**Can you develop a bot for me?**

- I'd love to! Reach out to me if you'd like to hire me.
