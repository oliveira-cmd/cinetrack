const express = require('express');
const app = express();
const {runDatabase} = require('./config/database');
const movieRoutes = require('./routes/movies');

app.use(express.json());
app.use('/api', movieRoutes);
app.listen(3000);

runDatabase();