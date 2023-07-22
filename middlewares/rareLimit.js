const rateLimit = require('express-rate-limit');

module.exports = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 300,
  message: 'Слишком много запросов с одного IP',
});
