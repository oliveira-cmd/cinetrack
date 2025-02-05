const History = require('../model/history')

const HistoryController = {
    async addHistory(data){
        const {username,uuid,oldStatus,newStatus,time} = data
        try {
            const history = await new History({username,uuid,oldStatus,newStatus,time})
            await history.save();
        } catch(error){
            console.error(error)
        }
    }
}

module.exports = HistoryController;