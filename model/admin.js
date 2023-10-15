const mongoose = require('mongoose')
const Schema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    }

})


const Admin = mongoose.model("admin", Schema)
module.exports = Admin