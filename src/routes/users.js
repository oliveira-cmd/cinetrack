const express = require('express');
const UserController = require('../controllers/users')
const MiddlewareController = require('../controllers/middleware');
const router = express.Router();

router.post('/', UserController.addUser);
router.get('/token',MiddlewareController.createToken);

module.exports = router;