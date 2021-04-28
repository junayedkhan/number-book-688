const mongoose = require('mongoose');


const data_schema = mongoose.Schema({
    name: {
        type : String
    },
    number: {
        type : String
    }

},{timestamps: true})


const data = mongoose.model('data_schema', data_schema)

module.exports = data