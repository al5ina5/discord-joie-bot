const fs = require('fs');

let rawdata = fs.readFileSync('./data/country-list.json');
let countries = JSON.parse(rawdata);

exports.get = (country) => countries.find(x => x.name.toLowerCase().replace(/\s/g,'') == country.toLowerCase() || x.code.toLowerCase()  == country.toLowerCase());