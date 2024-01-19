const router = require('express').Router();
const userController= require('./UserControllers');
const {verifyAuth} = require('./middleware/Auth');

router.post('/create', userController.createUser);
router.get('/get/:user_id',verifyAuth, userController.fetchUser)

module.exports = router;