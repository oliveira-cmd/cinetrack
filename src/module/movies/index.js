const {callApi} = require('../../config/api')

async function getMovieDataByName(name) {
    const teste = await callApi('GET', 'search/movie?query='+name.replace('','+'));
    return teste
    
}

module.exports = {getMovieDataByName}