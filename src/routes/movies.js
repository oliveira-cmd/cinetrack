const express = require('express');
const MovieController = require('../controllers/movies')
const router = express.Router();

router.get('/movie', MovieController.getMoviesExternalApi);
router.get('/filme/:id', MovieController.getMovieDataByUuid);
router.get('/filme', MovieController.getAllMovies);
router.post('/filme', MovieController.addMovie);
router.post('/filme/:id/:rating', MovieController.updateRatingById);
router.put('/filme/:id/:status', MovieController.updateStatusMovieByUuid);

module.exports = router;