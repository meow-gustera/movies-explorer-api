const router = require('express').Router();

const {
  getMovies,
  postMovie,
  deleteMovie,
} = require('../controllers/movies');

const { movieValidation, idValidation } = require('../middlewares/validation/movieValidation');

// возвращает все сохранённые текущим  пользователем фильмы
router.get('/', getMovies);
// создаёт фильм с переданными в теле
router.post('/', movieValidation, postMovie);
// удаляет сохранённый фильм по id
router.delete('/:movieId', idValidation, deleteMovie);

module.exports = router;
