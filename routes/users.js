const router = require('express').Router();
const { userValidationProfile } = require('../middlewares/validation/userValidation');

const {
  changeProfile,
  getUserMe,
} = require('../controllers/users');

router.get('/me', getUserMe);
router.patch('/me', userValidationProfile, changeProfile);

module.exports = router;
