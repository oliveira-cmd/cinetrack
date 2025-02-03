const express = require('express');
const app = express();
const {runDatabase} = require('./config/database');
const {getMovieDataByName} = require('./module/movies/index')
app.use(express.json());
/*runDatabase();*/

app.post('/filme', async (req, res) =>{
    const {name_movie} = req.body
    const movie_data = await getMovieDataByName(name_movie)
    res.send(movie_data)

})

app.listen(3000);