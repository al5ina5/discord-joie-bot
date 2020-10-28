const Discord = require('discord.js')

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomEmoji(){
    let emoji = ['😀','😃','😄','😁','😆','😅','😂','☺️','😊','😇','🙂🙃','😉','😌','😍','🥰😘','😗','😙','😚','😋','😛','😝','😜','😎','🤩😏','😒','😞','😔','😟','😕','🙁☹️','😣','😖','😫'];
    return emoji[getRandomInt(0,emoji.length)];
}

function getUserFromMention(client,mention) {
    if (!mention) return;

    if (mention.startsWith('<@') && mention.endsWith('>')) {
        mention = mention.slice(2, -1);

        if (mention.startsWith('!')) {
            mention = mention.slice(1);
        }

        return client.users.cache.get(mention);
    }
}

function getRandomColor() {
    return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
}

function embedded_message(title,description,url='',image='',fields=[],thumbnail='',footer='Made By Nexus'){
    var message = new Discord.MessageEmbed()
        .setColor(getRandomColor())
        .setTitle(title)
        .setDescription(description)
        .setTimestamp()
        .setFooter(footer);
    (url) ? message.setURL(url) : null;
    (thumbnail) ? message.setThumbnail(thumbnail) : null;
    (image) ? message.setImage(image) : null;
    (Array.isArray(fields) && fields.length) ? message.addFields(fields) : null;
    return message;
}

module.exports = {
getConsoleColor: () => {return "\x1b["+getRandomInt(30,48)+"m%s\x1b[0m";},
getRandomInt,getRandomEmoji,getUserFromMention,embedded_message,getRandomColor
};