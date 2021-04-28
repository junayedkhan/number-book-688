const mongoose = require('mongoose');


const register_schema = mongoose.Schema({
    name: {
        type : String
    },
    email: {
        type : String
    },
    password: {
        type : String
    },
    confirm_password: {
        type : String
    }

},{timestamps: true})


const register_model = mongoose.model('register_model', register_schema)

module.exports = register_model