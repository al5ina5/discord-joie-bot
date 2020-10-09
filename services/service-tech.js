const db = require('../mongo')

const getById = exports.getById = async (id) => {
    return await db.UserModel.findOne({discord_id: id});
};

const addTechnology = exports.addTechnology = async (id, technologies) => {
    await db.UserModel.updateOne(
        {discord_id: id},
        {$push: {techStack: { $each: technologies } } },
        {new: true, upsert: true, setDefaultsOnInsert:true }
        ).exec();
};