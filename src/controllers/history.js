const History = require('../model/history');

const HistoryController = {
    async addHistory(data){
        const {username,uuid,oldStatus,newStatus,time} = data
        try {
            const history = await new History({username,uuid,oldStatus,newStatus,time})
            await history.save();
        } catch(error){
            console.error(error)
        }
    },

    async getHistory(req, res) {
        try{
            const id = req.params.id;
            const movie = await History.find({uuid: id});

            if(movie){
                res.status(200).json({movie})
            }

        } catch(error){
            res.status(500).json({message: error.message})
        }
    }
}

module.exports = HistoryController;