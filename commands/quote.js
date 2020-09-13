const hp = require('../functions/helper-nexus');
const quote_lib = require('../libraries/quote-lib');
const {curly,Curl} = require('node-libcurl');

exports.run = (client, message, args) => {
    let argument = (typeof args[1] === 'undefined') ? 'random' : args[1];
    console.log('Color:'+hp.getRandomColor());
    switch (argument){
        case 'today':
            const curl = new Curl();
            curl.setOpt('URL', 'https://quotes.rest/qod?language=en');
            curl.setOpt('FOLLOWLOCATION', true);
            curl.on('end', function (statusCode, data, headers) {
                data = JSON.parse(data);
                let quote_data = data.contents.quotes[0];
                message.channel.send(hp.embedded_message(quote_data.title,quote_data.quote,'','',[],'',quote_data.author));
                this.close();
            });
            curl.on('error', ()=>{curl.close.bind(curl);});
            curl.perform();
            break;
        default:
            let quote = quote_lib[hp.getRandomInt(0,quote_lib.length)];
            message.channel.send(hp.embedded_message((quote.author) ? quote.author : 'Quote:',quote.text));
        }

};