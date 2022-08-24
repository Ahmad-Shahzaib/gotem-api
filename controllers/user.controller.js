const ApiError = require('../exceptions/ApiError');
const userService = require('../service/user.service');
const { validationResult } = require('express-validator');
const { UserRole } = require('../models/user.model');

class UserController {
	async registration(req, res, next) {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return next(ApiError.badRequest('Registration error', errors.array()));
			}

			const userData = req.body;
			const filePath = req.filePath;
			const files = req.files;

			const { firstName, lastName } = await userService.registration(
				userData,
				files,
				filePath
			);
			return res.json({ message: `User ${firstName} ${lastName} has been created` });
		} catch (e) {
			return next(e);
		}
	}

	async login(req, res, next) {
		try {
			const { email, password } = req.body;
			const { token, user } = await userService.login(email, password);
			return res.json({ message: { token, user } });
		} catch (e) {
			return next(e);
		}
	}

	async check(req, res, next) {
		try {
			const { token, user } = await userService.check(req.user.email);
			return res.json({ message: { token, user } });
		} catch (e) {
			return next(e);
		}
	}

	async lostPassword(req, res, next) {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return next(ApiError.badRequest("Email doesn't valid or exist", errors.array()));
			}
			const { email } = req.body;
			await userService.lostPassword(email);
			return res.json({ message: 'Request was send' });
		} catch (e) {
			return next(e);
		}
	}

	async resetPassword(req, res, next) {
		try {
			const { link, password } = req.body;
			await userService.resetPassword(link, password);
			return res.json({ message: 'Password was changed' });
		} catch (e) {
			return next(e);
		}
	}

	async getOneUser(req, res, next) {
		try {
			const userId = req.params.id;
			const user = await userService.getOneUser(userId);
			return res.json({ message: user });
		} catch (e) {
			return next(e);
		}
	}

	async getAllUsers(req, res, next) {
		try {
			const queryParams = req.query;
			const ownerId = req.user.id;
			const { rows, count } = await userService.getAllUsers(ownerId, queryParams);
			return res.json({ message: { rows, count } });
		} catch (e) {
			return next(e);
		}
	}

	async deleteUser(req, res, next) {
		try {
			const { id } = req.params;
			const isDeleted = await userService.deleteUser(id);
			return res.json({ message: isDeleted });
		} catch (e) {
			return next(e);
		}
	}

	async updateUser(req, res, next) {
		try {
			const userData = req.body;
			const filePath = req.filePath;
			const files = req.files;

			const updatedUser = await userService.updateUser(userData, files, filePath);
			return res.json({ message: updatedUser });
		} catch (e) {
			return next(e);
		}
	}

	async getRoles(req, res, next) {
		try {
			const roles = await userService.getRoles();
			return res.json({ message: roles });
		} catch (e) {
			return next(e);
		}
	}
}

module.exports = new UserController();
