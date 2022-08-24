const Router = require('express').Router;
const router = new Router();
const { check } = require('express-validator');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

router.post(
	'/registration',
	[
		check('email', 'Email cannot be empty').isEmail(),
		check('password', 'Password must be greater than 4 and less than 10').isLength({ min: 8 }),
	],
	userController.registration
);
router.post('/login', userController.login);
router.get('/auth', authMiddleware, userController.check);
router.post(
	'/lost-password',
	[check('email', 'Email cannot be empty').isEmail()],
	userController.lostPassword
);
router.post('/reset-password', userController.resetPassword);
router.get('/get-user', authMiddleware, userController.getOneUser);
router.get('/get-all-users', authMiddleware, roleMiddleware(['admin']), userController.getAllUsers);
router.delete(
	'/delete-user/:id',
	authMiddleware,
	roleMiddleware(['admin']),
	userController.deleteUser
);
router.put('/update-user', authMiddleware, roleMiddleware(['admin']), userController.updateUser);
router.get('/roles', userController.getRoles);

module.exports = router;
