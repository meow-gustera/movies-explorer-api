const jwt = require('jsonwebtoken');
const ErrorStatusUnauthorized = require('../utilits/errorStatusUnauthorized');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { NODE_ENV, JWT_SECRET } = process.env;
  const token = req.cookies.jwt;

  if (!token) {
    return next(new ErrorStatusUnauthorized('При авторизации произошла ошибка. Токен не передан или передан не в том формате.'));
  }

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return next(new ErrorStatusUnauthorized('При авторизации произошла ошибка. Переданный токен некорректен.'));
  }

  req.user = payload;
  next();
};
