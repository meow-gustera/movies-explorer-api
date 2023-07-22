const router = require('express').Router();
const userRouter = require('./users');
const moviesRouter = require('./movies');
const auth = require('../middlewares/auth');
const { login, createUser, signoutUser } = require('../controllers/users');
const { userValidation } = require('../middlewares/validation/userValidation');
const ErrorStatusNotFound = require('../utilits/errorStatusNotFound');

router.post('/signin', userValidation, login);
router.post('/signup', userValidation, createUser);

router.use(auth);

router.get('/', (req, res) => {
  res.send('Вы авторизованы');
});

router.use('/users', userRouter);
router.use('/movies', moviesRouter);
router.post('/signout', signoutUser);

router.use('*', (req, res, next) => {
  next(new ErrorStatusNotFound('Страница по указанному маршруту не найдена.'));
});

module.exports = router;
