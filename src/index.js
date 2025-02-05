const express = require('express');
const app = express();
const {runDatabase} = require('./utils/database');
const movieRoutes = require('./routes/movies');
const userRoutes = require('./routes/users');
const logRoutes = require('./routes/logs');
const historyRoutes = require('./routes/history');
const authMiddleware = require('./middlewares/auth')
const MiddlewareController = require('./controllers/middleware');

app.use(express.json());
app.use('/user', userRoutes);
app.use('/api',authMiddleware,movieRoutes);
app.use('/logs', authMiddleware, logRoutes);
app.use('/filme', authMiddleware, historyRoutes);

app.get('/token',MiddlewareController.getUsernameByJwt)
app.listen(3000);

runDatabase();