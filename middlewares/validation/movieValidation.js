/* eslint-disable no-useless-escape */
const { celebrate, Joi } = require('celebrate');

const movieValidation = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required(),
    trailerLink: Joi.string().required(),
    thumbnail: Joi.string().required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const idValidation = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().length(24).hex(),
  }),
});

module.exports = { movieValidation, idValidation };
