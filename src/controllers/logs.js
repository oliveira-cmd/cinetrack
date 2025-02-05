const Logs = require('../model/logs');

const LogsController = {
    async getLogs(req, res) {
        try {
            const logs = await Logs.find({});
            res.status(200).json(logs)
        } catch(error){
            res.status(500).json(error.message)
        }
    }
}

module.exports = LogsController