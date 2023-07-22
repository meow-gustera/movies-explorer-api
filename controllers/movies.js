const Movie = require('../models/movie');
const ErrorStatusBadRequest = require('../utilits/errorStatusBadRequest');
const ErrorStatusNotFound = require('../utilits/errorStatusNotFound');
const ErrorStatusForbidden = require('../utilits/errorStatusForbidden');

// get
module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

// post
module.exports.postMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        next(new ErrorStatusBadRequest('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

// delete
module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId)
    .then((movie) => {
      if (movie === null) {
        throw new ErrorStatusNotFound('Фильм по указанному _id не найден.');
      } else if (movie.owner._id.toString() === req.user._id) {
        return movie.deleteOne()
          .then(() => res.send({ message: `Удалена карточка: ${movie}` }));
      } else {
        throw new ErrorStatusForbidden('Удалить фильм может только её владелец.');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorStatusBadRequest('Передан некорректный формат _id карточки.'));
      } else {
        next(err);
      }
    });
};
