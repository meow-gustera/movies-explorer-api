const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ErrorStatusBadRequest = require('../utilits/errorStatusBadRequest');
const ErrorStatusNotFound = require('../utilits/errorStatusNotFound');
const ErrorStatusConflict = require('../utilits/errorStatusConflict');

module.exports.login = (req, res, next) => {
  const { NODE_ENV, JWT_SECRET } = process.env;

  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        httpOnly: true,
      })
        .send({ message: 'Вы авторизовались' })
        .end();
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
    .then((user) => res.send({
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorStatusBadRequest('Переданы некорректные данные при создании юзера.'));
      } else if (err.code === 11000) {
        next(new ErrorStatusConflict('Такой email уже используется'));
      } else {
        next(err);
      }
    });
};

module.exports.getUserMe = (req, res, next) => {
  console.log(req.user._id);
  User.findById(req.user._id)
    .then((user) => {
      if
      (user === null) {
        throw new ErrorStatusNotFound('Необходима авторизация');
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorStatusBadRequest('Переданы некорректные данные при создании юзера.'));
      } else if (err.code === 11000) {
        next(new ErrorStatusConflict('Такой email уже используется'));
      } else {
        next(err);
      }
    });
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
