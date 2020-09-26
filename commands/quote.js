const hp = require('../functions/helper-nexus');
const quote_lib = require('../libraries/quote-lib');
const axios = require('axios');

exports.run = (client, message, args) => {
    let argument = (typeof args[1] === 'undefined') ? 'random' : args[1];
    console.log('Color:' + hp.getRandomColor());
    switch (argument) {
        case 'today':
            let today = new Date();
            let dd = String(today.getDate()).padStart(2, '0');
            axios.get('https://type.fit/api/quotes')
                .then(function (response) {
                    let quote_data = response.data[dd];
                    message.channel.send(hp.embedded_message((quote_data.author) ? quote_data.author : 'Quote of the Day: ', quote_data.text));
                })
                .catch(function (error) {
                    console.log(error);
                });
            break;
        default:
            let quote = quote_lib[hp.getRandomInt(0, quote_lib.length)];
            message.channel.send(hp.embedded_message((quote.author) ? quote.author : 'Quote:', quote.text));
    }

};

exports.help = "Display the Quote";