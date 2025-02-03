const { response } = require("express");
const http = require("https");
require('dotenv').config();

async function callApi(method, path){
    const hostname = "https://api.themoviedb.org/";
    const headers = {
        'Authorization': 'Bearer ' + process.env.API_TOKEN 
    }
    const api_version = '3/'
    let body_data=[];
    
    try {
        const options = {
            "method": method,
            "headers": headers
        };

        const dataPromise = await fetch(hostname+api_version+path,options)
            .then(response => response.json())
            .catch(error => console.error('error on request api ' +error))

        return dataPromise;
        


    } catch(error){
        console.log('error');
        
        console.error(error)
    }

}

module.exports = {callApi}