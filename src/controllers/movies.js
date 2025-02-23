const {callApi} = require('../utils/api')
const Movies = require('../model/movies');
const LogsController = require('../middlewares/logs');
const HistoryController = require('../controllers/history');
const {dateNow} = require('../utils/date')
const { v4: uuidv4 } = require('uuid');

const MovieController = {
    async addMovie(req, res) {
        const dataLog = {
            method: req.method,
            url: req.rawHeaders[1] + req.originalUrl,
            timeStamp: await dateNow(),
        };

        
        try {
            const name = req.body.name

            const movie_data = await callApi('GET', 'search/movie?query=' + encodeURIComponent(name));
            const genre = await callApi('GET', 'genre/movie/list?language=en');
            if (movie_data.results) {
                const data = movie_data.results.filter(result => result.original_title === name);
    
                if(data.length){
                    const genre_name = [];
                    if(genre){
                        const genres = genre.genres;
                        const genre_names = genres.map(gen => {
                            if(data[0].genre_ids.includes(gen.id)){
                                genre_name.push(gen.name)
                            }
                            
                        })
                    }
                    const uuid = uuidv4();
                    const {title, overview, release_date} = data[0];     
                    const gen_names =  JSON.stringify(genre_name);
                    console.log({uuid, title, overview, release_date,gen_names})
                    const movie = new Movies({uuid, title, overview, release_date,gen_names})
                    await movie.save();
                    let message = `O filme ${name} foi adicionado a lista de desejos com sucesso!`;
                    dataLog.movieId = uuid;
                    dataLog.message = message;
                    dataLog.statusCode = 200;
                    res.status(200).json({message: message, data: movie})

                    LogsController.saveLog(req.user.data.username,dataLog)
                } else {
                    let message = `Nenhum filme foi encontrado com o nome ${name}. De uma olhada em nossa documentação e consulte o metodo que traz todos os filmes disponiveis.`;
                    dataLog.message = message
                    dataLog.statusCode = 200;
                    res.status(200).json({message: message})
                    LogsController.saveLog(req.user.data.username,dataLog)
                }
            }
        } catch (error) {
            dataLog.message = error.message;
            dataLog.statusCode = 500;
            res.status(500).json({message: `Não foi possivel adicionar o filme a lista de desejos`, error: error.message})
            LogsController.saveLog(req.user.data.username,dataLog)
        }
    },

    async getMoviesExternalApi(req, res){

        const dataLog = {
            method:req.method,
            url: req.rawHeaders[1] + req.originalUrl,
            timeStamp: await dateNow(),
        }

        try{

            let titles = [];
            let page = 1;

            if(req.query.page){
                page = req.query.page
            }

            const movies = await  callApi('GET', `discover/movie?include_adult=false&include_video=false&page=${page}&sort_by=popularity.desc`);

            if(movies.results){
                movies.results.map(movie => {
                    titles.push(movie.original_title)
                });
                dataLog.message = titles;
                dataLog.pageRequestExternalApi = page;
                dataLog.statusCode = 200;
                res.status(200).json({message: titles})
                LogsController.saveLog(req.user.data.username, dataLog)
            } else {
                const message = 'Nenhum filme foi encontrado, verifique a API';
                dataLog.message = message
                dataLog.statusCode = 200;
                res.status(200).json({message: message})
                LogsController.saveLog(req.user.data.username, dataLog)
            }
        } catch(error){
            dataLog.message = error.message;
            dataLog.statusCode = 500;
            res.status(500).json({message: 'Ocorreu um erro ao realizar a requisição', error: error.message})
            LogsController.saveLog(req.user.data.username, dataLog)
        }
    },
    
    async getAllMovies(req, res){

        const dataLog = {
            method:req.method,
            url: req.rawHeaders[1] + req.originalUrl,
            timeStamp: await dateNow(),
        }

        try{
            const movies = await Movies.find({});
            if(movies){
                dataLog.message = movies;
                dataLog.statusCode = 200;
                res.status(200).json({message: movies})
                LogsController.saveLog(req.user.data.username, dataLog)
            } else {
                const message = 'Sua Lista de Desejos não possui nenhum filme ainda';
                dataLog.message = message;
                dataLog.statusCode = 200;
                res.status(200).json({message: message})
                LogsController.saveLog(req.user.data.username, dataLog)
            }
        } catch(error){
            dataLog.message = error.message;
            dataLog.statusCode = 500;
            res.status(500).json({message: 'Ocorreu um erro ao realizar a requisição', error: error.message})
            LogsController.saveLog(req.user.data.username, dataLog)
        }
    },
    
    async updateStatusMovieByUuid(req, res) {
        const { id, status } = req.params;
    
        const dataLog = {
            method: req.method,
            url: req.rawHeaders[1] + req.originalUrl,
            timeStamp: await dateNow(),
        };
    
        try {
            const statusPermitidos = ['a assistir', 'assistido', 'avaliado', 'recomendado', 'nao recomendado'];
    
            if (!statusPermitidos.includes(status)) {
                const message = `O status "${status}" não é válido.`;
                dataLog.message = message;
                dataLog.statusCode = 400;
                LogsController.saveLog(req.user.data.username, dataLog);
                return res.status(400).json({ message, statusPermitidos });
            }
    
            const movie = await Movies.findOne({ uuid: id });
    
            if (!movie) {
                const message = `Filme com ID "${id}" não encontrado.`;
                dataLog.message = message;
                dataLog.statusCode = 404;
                LogsController.saveLog(req.user.data.username, dataLog);
                return res.status(404).json({ message });
            }
    
            const transicoesValidas = {
                'a assistir': ['assistido'],
                'assistido': ['avaliado'],
                'avaliado': ['recomendado', 'nao recomendado'],
            };
    
            if (!transicoesValidas[movie.status]?.includes(status)) {
                const message = `A transição de "${movie.status}" para "${status}" não é permitida.`;
                dataLog.message = message;
                dataLog.statusCode = 400;
                LogsController.saveLog(req.user.data.username, dataLog);
                return res.status(400).json({ message });
            }
    
            movie.status = status;
            await movie.save();

            const dataHistory = {
                username: req.user.data.username,
                uuid: id,
                oldStatus: movie.status,
                newStatus: status,
                time: await dateNow(),
            };
            HistoryController.addHistory(dataHistory);
    
            dataLog.message = `O filme "${id}" teve seu status atualizado para "${status}".`;
            dataLog.statusCode = 200;
            LogsController.saveLog(req.user.data.username, dataLog);
    
            return res.status(200).json({ movie });
        } catch (error) {
            dataLog.message = error.message;
            dataLog.statusCode = 500;
            LogsController.saveLog(req.user.data.username, dataLog);
            return res.status(500).json({ message: 'Ocorreu um erro ao realizar a requisição', error: error.message });
        }
    },

    async getMovieDataByUuid(req, res){
        
        const dataLog = {
            method: req.method,
            url: req.rawHeaders[1] + req.originalUrl,
            timeStamp: await dateNow(),
        };

        try {
            const id = req.params.id
            const movie = await Movies.find({uuid:id});
            if(movie){
                dataLog.message = movie;
                dataLog.statusCode = 200;
                res.status(200).json({movie})
                LogsController.saveLog(req.user.data.username, dataLog)
            } else {
                const message = `Não foi encontrado nenhum filme com o id: ${id}`
                dataLog.message = message
                dataLog.statusCode = 200;
                res.status(200).json({message: message})
                LogsController.saveLog(req.user.data.username, dataLog)
            }
        } catch(error){
            dataLog.message = error.message;
            dataLog.statusCode = 500;
            res.status(500).json({message: 'Ocorreu um erro ao realizar a requisição', error: error.message})
            LogsController.saveLog(req.user.data.username, dataLog)
        }
    },
    
    async updateRatingById(req, res){

        const dataLog = {
            method: req.method,
            url: req.rawHeaders[1] + req.originalUrl,
            timeStamp: await dateNow(),
        };
        try {
            const {id, rating} = req.params;
            const movie = await Movies.find({uuid:id});
            if(movie && rating < 6){
                const newMovie = await Movies.findOneAndUpdate({uuid:id}, {rating:rating});
                newMovie.rating = rating;
                dataLog.message = `O filme ${id} teve sua nota inserida para ${rating}`;
                dataLog.statusCode = 200;
                res.status(200).json({newMovie})
                LogsController.saveLog(req.user.data.username,dataLog)
            } else if(rating > 5){
                const message = `Nao foi possicel inserir a nota para o filme ${id} pois a nota inserida não é valida. Nota inserida: ${rating}`;
                dataLog.message = message;
                dataLog.statusCode = 200;
                res.status(200).json({message: message})
                LogsController.saveLog(req.user.data.username,dataLog)
            }else {
                const message = `Não foi encontrado nenhum filme com o id: ${id}`;
                dataLog.message = message;
                dataLog.statusCode = 200;
                res.status(200).json({message: message});
                LogsController.saveLog(req.user.data.username,dataLog)
            }
        } catch(error){
            dataLog.message = error.message;
            dataLog.statusCode = 500;
            res.status(500).json({message: 'Ocorreu um erro ao realizar a requisição', error: error.message})
            LogsController.saveLog(req.user.data.username,dataLog);
        }
    }
        
}


module.exports = MovieController