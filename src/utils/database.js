const mongoose = require('mongoose');
require("dotenv").config();

async function runDatabase(){
    try{
        const mongoUri = process.env.URI_CONNECT || 'mongodb://localhost:27017/cinetrack';
        await mongoose.connect(mongoUri, {});
        console.log("Database connected");
    } catch(error){
        console.error(error)
        console.log("Error on connect database");
        process.exit(1);
    }
}

module.exports = {runDatabase}