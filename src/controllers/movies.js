const {callApi} = require('../utils/api')
const Movies = require('../model/movies');
const LogsController = require('../controllers/logs');
const { v4: uuidv4 } = require('uuid');

const MovieController = {
    async addMovie(req, res) {
        try {
            const name = req.body.name

            const movie_data = await callApi('GET', 'search/movie?query=' + encodeURIComponent(name));
    
            if (movie_data.results) {
                const data = movie_data.results.filter(result => result.original_title === name);
    
                if(data.length){
                    const uuid = uuidv4();
                    const {title, overview, original_language} = data[0];                    
                    const movie = new Movies({uuid, title, overview, original_language})
                    await movie.save();
                    const timestamps = {
                        createdAt: movie.createdAt,
                        updatedAt: movie.updatedAt
                    }
                    LogsController.saveLog(req.user.data.username,req.method, req.rawHeaders[1]+req.originalUrl, timestamps, movie._id)
                    res.status(200).json({message: `O filme ${name} foi adicionado a lista de desejos com sucesso!`})
                } else {
                    res.status(200).json({message: `Nenhum filme foi encontrado com o nome ${name}. De uma olhada em nossa documentação e consulte o metodo que traz todos os filmes disponiveis.`})
                }
            }
        } catch (error) {
            res.status(500).json({message: `Não foi possivel adicionar o filme a lista de desejos`, error: error.message})
        }
    },

    async getMoviesExternalApi(req, res){
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
                res.status(200).json({message: titles})
            } else {
                res.status(200).json({message: 'Nenhum filme foi encontrado, verifique a API'})
            }
        } catch(error){
            res.status(500).json({message: 'Ocorreu um erro ao realizar a requisição', error: error.message})
        }
    },
    
    async getAllMovies(req, res){
        try{
            const movies = await Movies.find({});
            if(movies){
                res.status(200).json({message: movies})
                return movies
            } else {
                res.status(200).json({message: 'Nenhum filme foi adicionado a lista de desejos'})
            }
        } catch(error){
            res.status(500).json({message: 'Ocorreu um erro ao realizar a requisição', error: error.message})
        }
    },
    
    async updateStatusMovieByUuid(req, res){
        try {
            const status_permitidos = ['a assistir','assistido', 'avaliado','recomendado','nao recomendado'];
            const {id, status} = req.params

            const movie_data = await Movies.find({uuid:id});
            if(movie_data && status_permitidos.includes(status)){
                const movie = await Movies.findOneAndUpdate({uuid: id},{status:status});
                movie.status = status;

                res.status(200).json({movie})
            } else if(!status_permitidos.includes(status)){
                res.status(200).json({message: `O status inserido nao é permitido!`, status: status_permitidos})
            }else {
                res.status(200).json({message: `Não foi encontrado nenhum filme com o id: ${id}`})
            }
        } catch(error){
            res.status(500).json({message: 'Ocorreu um erro ao realizar a requisição', error: error.message})
        }
    },
    
    async getMovieDataByUuid(req, res){
        try {
            const id = req.params.id
            const movie = await Movies.find({uuid:id});
            if(movie){
                res.status(200).json({movie})
            } else {
                res.status(200).json({message: `Não foi encontrado nenhum filme com o id: ${id}`})
            }
        } catch(error){
            res.status(500).json({message: 'Ocorreu um erro ao realizar a requisição', error: error.message})
        }
    },
    
    async updateRatingById(req, res){
        try {
            const {id, rating} = req.params;
            const movie = await Movies.find({uuid:id});
            if(movie && rating < 6){
                const newMovie = await Movies.findOneAndUpdate({uuid:id}, {rating:rating});
                newMovie.rating = rating;
                res.status(200).json({newMovie})
            } else if(rating > 5){
                res.status(200).json({message: `A nota maxima permitida é 5`})
            }else {
                res.status(200).json({message: `Não foi encontrado nenhum filme com o id: ${id}`})

            }
        } catch(error){
            res.status(500).json({message: 'Ocorreu um erro ao realizar a requisição', error: error.message})
        }
    }
        
}


module.exports = MovieController