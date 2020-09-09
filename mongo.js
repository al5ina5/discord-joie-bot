const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})

exports.UserModel = mongoose.model('UserModel', mongoose.Schema({
    discord_id: String,
    points: {
        type: Number,
        default: 1
    }
}))