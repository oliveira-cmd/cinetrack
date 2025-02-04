const User = require('../model/users');

const UserController = {
    async addUser(req, res) {
        try {
            const {username, password} = req.body
            const user = await new User({username, password});
            await user.save();
            res.status(200).json({user})
        } catch(error){
            res.status(500).json({message: 'Ocorreu um erro ao realizar a requisição', error: error.message})
        }
    }
}

module.exports = UserController