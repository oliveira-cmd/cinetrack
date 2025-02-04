const express = require('express');
const app = express();
const {runDatabase} = require('./utils/database');
const movieRoutes = require('./routes/movies');
const userRoutes = require('./routes/users')
const authMiddleware = require('./middlewares/auth')

app.use(express.json());
app.use('/user', userRoutes);
app.use('/api',authMiddleware,movieRoutes);
app.listen(3000);

runDatabase();