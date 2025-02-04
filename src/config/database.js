const mongoose = require('mongoose');
require("dotenv").config();

async function runDatabase(){
    try{
        await mongoose.connect(process.env.URI_CONNECT, {});
        console.log("Database connected");
    } catch(error){
        console.error(error)
        console.log("Error on connect database");
        process.exit(1);
    }
}

module.exports = {runDatabase}