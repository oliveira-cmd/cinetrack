const jwt = require('jsonwebtoken');
require('dotenv').config()
const authMiddleware = (req, res, next) => {
    
    try {
        if(!req.header('Authorization')){
            res.status(401).json({message: 'Acesso negado!'})
        } else {
            const token = req.header('Authorization');
            const decoded = jwt.verify(token, process.env.JWT_TOKEN)
            req.user = decoded
            next();
        }
    } catch(error){
        res.status(500).json({message: 'Ocorreu um erro ao realizar a requisição', error: error.message})
    }
};

module.exports = authMiddleware;