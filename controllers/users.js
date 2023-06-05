const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ErrorStatusBadRequest = require('../utilits/errorStatusBadRequest');
const ErrorStatusNotFound = require('../utilits/errorStatusNotFound');

module.exports.login = (req, res, next) => {
  const { NODE_ENV, JWT_SECRET } = process.env;
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        httpOnly: true,
      })
        .send({ message: 'Вы авторизовались' });
    })
    .catch(next);
};

module.exports.signoutUser = (req, res) => {
  res.clearCookie('jwt').send('Кука удалена');
};

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => res.status(201).send({
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorStatusBadRequest('Переданы некорректные данные при создании юзера.'));
      } else {
        next(err);
      }
    });
};

module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if
      (user === null) {
        throw new ErrorStatusNotFound('Необходима авторизация');
      } else {
        res.send(user);
      }
    })
    .catch(next);
};

module.exports.changeProfile = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};
