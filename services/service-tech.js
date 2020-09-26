const db = require('../mongo')

const getById = exports.getById = async (id) => {
    
    const user = await db.UserModel.findOne({discord_id:id})
    return user;
};

const addTechnology = exports.addTechnology = async (id,technology) => {
    await db.UserModel.updateOne(
        {discord_id: id},
        {$push: {techStack: technology.toLowerCase()}},{new: true, upsert: true,setDefaultsOnInsert:true }).exec();
};