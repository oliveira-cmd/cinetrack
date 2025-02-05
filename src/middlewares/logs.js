const Logs = require('../model/logs')

const LogsController = {
    async saveLog(username,data){
        try{
            const action = JSON.stringify(data);
            const log = await new Logs({username, action})
            await log.save();
        } catch(error){
            console.error(error)
        }
    }
}

module.exports = LogsController