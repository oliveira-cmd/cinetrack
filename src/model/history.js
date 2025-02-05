const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
    username: {type: String, required: true},
    uuid: {type: String, required: true},
    oldStatus: {type: String, required: true},
    newStatus: {type: String, required: true},
    time: {type: String, required:true},
}, {timestamps:true});

module.exports = mongoose.model('History', HistorySchema);