require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const handleError = require('./middlewares/handleError');
const appRouters = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const rateLimit = require('./middlewares/rareLimit');
const cors = require('./middlewares/cors');

const { PORT = 3000 } = process.env;
const app = express();

app.use(helmet());
app.use(rateLimit);
app.use(requestLogger);
app.use(cors);

mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb')
  .then(() => console.log('Подключилось к БД'))
  .catch((err) => console.log(`Ошибка: ${err.message}`));

app.use(express.json());
app.use(cookieParser());

app.use(appRouters);

app.use(errorLogger);
app.use(errors());

app.use(handleError);

app.listen(PORT, () => {
  console.log(`Порт: ${PORT}`);
});
