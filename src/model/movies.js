const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
    uuid: {type: String, required: true, unique:true},
    title: {type: String, required:true},
    overview: {type: String, required: true},
    original_language: {type: String, required:true},
    user_id: {type: String, default:'1'},
    status: {type: String, enum: ['A assistir', 'Assistido', 'Avaliado', 'Recomendado', 'Nao recomendado'], default: 'A assistir'},
    rating: {type:Number, enum: [0,1,2,3,4,5], default:0}
}, {timestamps:true});

module.exports = mongoose.model('Movie', MovieSchema);