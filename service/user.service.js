const { User } = require('../models');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const tokenService = require('../service/token.service');
const fileService = require('../service/file.service');
const mailService = require('../service/mail.service');
const ApiError = require('../exceptions/ApiError');
const { UserRole } = require('../models/user.model');
const { Op, fn, col, where } = require('sequelize');

class UserService {
	async registration(data, files, filePath) {
		const candidate = await User.findOne({ where: { email: data.email } });

		if (candidate) {
			throw ApiError.badRequest(`User with this ${data.email} already exists`);
		}

		const activationLink = uuid.v4();
		const hashPassword = await bcrypt.hashSync(data.password, 5);

		const newFileNamePhoto = uuid.v4() + '.' + files.photo.name.split('.').pop();
		const newFileNameDriverLicense =
			uuid.v4() + '.' + files.driverLicense.name.split('.').pop();
		const newFileNameDriverAlcotest =
			uuid.v4() + '.' + files.driverAlcotest.name.split('.').pop();
		const newFileNameContract = uuid.v4() + '.' + files.driverContract.name.split('.').pop();

		const user = await User.create({
			email: data.email,
			password: hashPassword,
			activationLink,
			firstName: data.firstName,
			lastName: data.lastName,
			photo: activationLink + '/' + newFileNamePhoto,
			dateOfBirth: data.dateOfBirth,
			dateOfRegistration: data.dateOfRegistration,
			slug: data.slug,
			phone: data.phone,
			driverRate: data.driverRate,
			dispatcherCommission: data.dispatcherCommission,
			driverResident: data.driverResident,
			driverAlcotest: activationLink + '/' + newFileNameDriverAlcotest,
			driverContract: activationLink + '/' + newFileNameContract,
			driverLicense: activationLink + '/' + newFileNameDriverLicense,
			notes: data.notes,
			userRoleId: data.roles,
			userStatus: data.userStatus,
		});

		fileService.createDir(filePath, activationLink);

		fileService.saveFile(files.photo, filePath + '/' + activationLink, newFileNamePhoto);
		fileService.saveFile(
			files.driverLicense,
			filePath + '/' + activationLink,
			newFileNameDriverLicense
		);
		fileService.saveFile(
			files.driverAlcotest,
			filePath + '/' + activationLink,
			newFileNameDriverAlcotest
		);
		fileService.saveFile(
			files.driverContract,
			filePath + '/' + activationLink,
			newFileNameContract
		);

		await mailService.sendRegistrationMail(data.email, data.password);

		return { firstName: user.firstName, lastName: user.lastName };
	}

	async login(email, password) {
		const user = await User.findOne({ where: { email }, include: [UserRole] });
		if (!user) {
			throw ApiError.badRequest('Wrong password or email');
		}

		const validPassword = bcrypt.compareSync(password, user.password);
		if (!validPassword) {
			throw ApiError.badRequest('Wrong password or email');
		}

		return {
			token: tokenService.generateAccessToken({
				id: user.id,
				email: user.email,
				role: user.user_role.name,
				slug: user.slug,
			}),
			user,
		};
	}

	async check(email) {
		const user = await User.findOne({
			where: { email: email },
			include: [UserRole],
		});
		if (!user) {
			throw ApiError.badRequest('User not found');
		}
		return {
			token: tokenService.generateAccessToken({
				id: user.id,
				email: user.email,
				role: user.user_role.name,
				slug: user.slug,
			}),
			user,
		};
	}

	async lostPassword(email) {
		const user = await User.findOne({ where: { email } });
		if (!user) {
			throw ApiError.badRequest('Invalid email');
		}
		await mailService.sendResetPasswordLink(
			user.email,
			'Link to create a new password',
			`${process.env.CLIENT_URL}change-password/?link=${user.activationLink}`
		);
	}

	async resetPassword(link, password) {
		const user = await User.findOne({ where: { activationLink: link } });
		if (!user) {
			throw ApiError.badRequest('Invalid activation link');
		}
		user.password = await bcrypt.hashSync(password, 5);
		await user.save();
	}

	async getOneUser(userId) {
		const user = await User.findOne({ where: { id: userId }, include: [UserRole] });
		if (!user) {
			throw ApiError.badRequest('User not found');
		}
		return user;
	}

	async getAllUsers(ownerId, queryParams) {
		let {
			status = '',
			search = '',
			dateFrom = null,
			dateTo = null,
			role = '',
			page = 1,
			limit = 10,
		} = queryParams;

		if (search) {
			search = search.toLowerCase();
		}
		let offset = +page * +limit - +limit;

		const whereUser = {};
		const whereUserRole = {};

		if (dateFrom && dateTo) {
			whereUser['createdAt'] = { [Op.between]: [new Date(dateFrom), new Date(dateTo)] };
		}

		if (status.length) {
			whereUser['userStatus'] = status;
		}

		if (role.length) {
			whereUserRole['name'] = role;
		}

		const { rows, count } = await User.findAndCountAll({
			where: {
				id: { [Op.not]: ownerId },
				...whereUser,
				[Op.and]: [
					{
						[Op.or]: [
							where(fn('lower', col('firstName')), 'LIKE', `%${search}%`),
							where(fn('lower', col('lastName')), 'LIKE', `%${search}%`),
							where(fn('lower', col('email')), 'LIKE', `%${search}%`),
							where(fn('lower', col('phone')), 'LIKE', `%${search}%`),
						],
					},
				],
			},
			include: [{ model: UserRole, where: whereUserRole }],
			distinct: true,
			limit: !search ? +limit : null,
			offset: !search ? +offset : null,
		});
		return { rows, count };
	}

	async deleteUser(id) {
		return await User.destroy({ where: { id } });
	}

	async updateUser(data, files, filePath) {
		const candidate = await User.findOne({ where: { email: data.email } });

		if (candidate && candidate.id !== +data.userId) {
			throw ApiError.badRequest(`User with this ${data.email} already exists`);
		}

		const user = await this.getOneUser(data.userId);

		for (let key of Object.keys(data)) {
			if (key === 'password') {
				user.password = await bcrypt.hashSync(data.password, 5);
			} else {
				user[key] = data[key];
			}
		}

		if (files.photo !== undefined) {
			const newFileNamePhoto = uuid.v4() + '.' + files.photo.name.split('.').pop();
			fileService.deleteFile(filePath, user.photo);
			user.photo = user.activationLink + '/' + newFileNamePhoto;
			fileService.saveFile(
				files.photo,
				filePath + '/' + user.activationLink,
				newFileNamePhoto
			);
		}
		if (files.driverLicense !== undefined) {
			const newFileNameDriverLicense =
				uuid.v4() + '.' + files.driverLicense.name.split('.').pop();
			fileService.deleteFile(filePath, user.driverLicense);
			user.driverLicense = user.activationLink + '/' + newFileNameDriverLicense;
			fileService.saveFile(
				files.driverLicense,
				filePath + '/' + user.activationLink,
				newFileNameDriverLicense
			);
		}
		if (files.driverAlcotest !== undefined) {
			const newFileNameDriverAlcotest =
				uuid.v4() + '.' + files.driverAlcotest.name.split('.').pop();
			fileService.deleteFile(filePath, user.driverAlcotest);
			user.driverAlcotest = user.activationLink + '/' + newFileNameDriverAlcotest;
			fileService.saveFile(
				files.driverAlcotest,
				filePath + '/' + user.activationLink,
				newFileNameDriverAlcotest
			);
		}
		if (files.driverContract !== undefined) {
			const newFileNameContract =
				uuid.v4() + '.' + files.driverContract.name.split('.').pop();
			fileService.deleteFile(filePath, user.driverContract);
			user.driverContract = user.activationLink + '/' + newFileNameContract;
			fileService.saveFile(
				files.driverContract,
				filePath + '/' + user.activationLink,
				newFileNameContract
			);
		}

		await user.save();
		await user.reload();
		return user;
	}

	async getRoles() {
		return await UserRole.findAll();
	}
}
module.exports = new UserService();
