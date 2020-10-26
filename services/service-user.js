//should be a DI class, keep it simple for now
const db = require('../mongo')

//gets a user by id or creates one in the db if he doesn't exist
var getById = exports.getById = (id, callback) => {
    
    db.UserModel.findOne({
        discord_id: id
    }, function (error, user) {
        if (!user) {
            user = new db.UserModel({ discord_id: id });
            user.save( callback(user));
        }else
            callback(user);
    })
};

var getByCountry = exports.getByCountry = (countryCode, callback) => { 
    db.UserModel.find({
        country: countryCode
    }, function (error, users) {
        if(error) throw error;
        callback(users);
    })
};

var setCountry = exports.setCountry = (id, country, callback) => {   
    db.UserModel.findOneAndUpdate({ discord_id: id }, {country: country.code}, {new: true, upsert: true,setDefaultsOnInsert:true }, (error,user)=>{
        if(callback) callback(user);
    });
};
