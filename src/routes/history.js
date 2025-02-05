const express = require('express');
const HistoryController = require('../controllers/history')
const router = express.Router();

router.get('/:id/historico', HistoryController.getHistory);

module.exports = router;