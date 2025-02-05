const express = require('express');
const LogsController = require('../controllers/logs')
const router = express.Router();

router.get('/', LogsController.getLogs);

module.exports = router;