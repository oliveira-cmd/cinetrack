const Logs = require('../model/logs')

const LogsController = {
    async saveLog(username, method, url,timestamp,movie_id){
        try{
            const data = {
                method: method,
                url: url,
                timestamp: timestamp,
                movie_id:movie_id
            };
            const action = JSON.stringify(data);
            const log = await new Logs({username, action})
            await log.save();
        } catch(error){
            console.error(error)
        }
    }
}

module.exports = LogsController