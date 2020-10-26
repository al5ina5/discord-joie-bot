const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})

exports.UserModel = mongoose.model('UserModel', mongoose.Schema({
    discord_id: String,
    country: {
        type: String,
        default: 'EARTH'
    },
    points: {
        type: Number,
        default: 1
    },
    techStack: Array
}))


