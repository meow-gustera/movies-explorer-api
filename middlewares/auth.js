const jwt = require('jsonwebtoken');
const ErrorStatusUnauthorized = require('../utilits/errorStatusUnauthorized');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { NODE_ENV, JWT_SECRET } = process.env;

  const token = req.cookies.jwt;

  if (!token) {
    return next(new ErrorStatusUnauthorized('Необходима авторизация'));
  }

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return next(new ErrorStatusUnauthorized('Необходима авторизация'));
  }

  req.user = payload;
  next();
};
