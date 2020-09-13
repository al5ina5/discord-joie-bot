let countries = require('../data/country-list.json')

exports.get = (country) => countries.find(x => x.name.toLowerCase().replace(/\s/g,'') == country.toLowerCase().replace(/\s/g,'') || x.code.toLowerCase()  == country.toLowerCase());

exports.getFlag = (countryObj) =>  {
    if(countryObj.code == "EARTH")
        return ':earth_americas:'
    else
        return `:flag_${countryObj.code.toLowerCase()}:`
}