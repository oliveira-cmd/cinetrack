const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (req, res) => {
    const {username, password} = req.body
    const token = jwt.sign({username, password}, process.env.JWT_TOKEN);

}

module.exports = generateToken;