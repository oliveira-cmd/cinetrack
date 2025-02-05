const mongoose = require('mongoose');

const LogsSchema = new mongoose.Schema({
    username: {type: String, required:true},
    action: {type: String, required:true}
},{timestamps:true})

module.exports = mongoose.model('Logs', LogsSchema);