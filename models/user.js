const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const ErrorStatusUnauthorized = require('../utilits/errorStatusUnauthorized');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Пелядь',
  },
  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Почта некорректная',
    },
  },
  password: {
    select: false,
    type: String,
    required: true,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new ErrorStatusUnauthorized('Вы ввели неправильный логин или пароль.');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new ErrorStatusUnauthorized('Вы ввели неправильный логин или пароль.');
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
