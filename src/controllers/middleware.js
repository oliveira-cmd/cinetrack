const jwt = require('jsonwebtoken')
const User = require('../model/users')
require('dotenv').config()
const MiddlewareController = {

    async createToken(req, res){
        
        try{
            let data = {
                username: req.body.username,
            };

            const verifyUser = await User.findOne({username:data.username});
            
            if(verifyUser){
                const token = jwt.sign({ exp: Math.floor(Date.now() / 1000) + (60 * 60),data }, process.env.JWT_TOKEN);
                res.status(200).json({token:token, message: 'Este token é valido por apenas 1 hora'})
            } else {
                res.status(200).json({message: 'Não foi encontrado nenhum usuario com o username fornecido!'})
            }
        } catch(error){
            res.status(500).json({message: 'Ocorreu um erro ao realizar a requisição', error: error.message})
        }
    },

    async getUsernameByJwt(req, res){

        jwt.verify(req.body.token, process.env.JWT_TOKEN, function(err, decoded) {
            console.log(decoded)
        });
    }

}

module.exports = MiddlewareController;