const sequelize = require('../database/db');
const { DataTypes } = require('sequelize');

const UserRole = sequelize.define(
	'user_role',
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		name: {
			type: DataTypes.STRING(255),
			unique: false,
			defaultValue: '',
			required: true,
		},
	},
	{
		timestamps: false,
	}
);

const UserAssigned = sequelize.define(
	'user_assigned',
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	},
	{
		timestamps: false,
	}
);

const Endorsements = sequelize.define(
	'endorsements',
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		name: {
			type: DataTypes.STRING,
			unique: false,
			defaultValue: '',
			required: true,
		},
	},
	{
		timestamps: false,
	}
);

const UserEndorsements = sequelize.define(
	'user_endorsements',
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	},
	{
		// options
		timestamps: false,
	}
);

const DriverType = sequelize.define(
	'driver_type',
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		name: {
			type: DataTypes.STRING,
			unique: false,
			defaultValue: '',
			required: true,
		},
	},
	{
		timestamps: false,
	}
);

const DriverStatus = sequelize.define(
	'driver_status',
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		name: {
			type: DataTypes.STRING,
			unique: false,
			defaultValue: '',
			required: true,
		},
	},
	{
		timestamps: false,
	}
);

const User = sequelize.define('user', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	email: { type: DataTypes.STRING(255), defaultValue: '', required: true, unique: false },
	firstName: {
		type: DataTypes.STRING(255),
		defaultValue: '',
		required: true,
	},
	lastName: { type: DataTypes.STRING(255), defaultValue: '', required: true },
	photo: { type: DataTypes.STRING(255), defaultValue: 'avatar.png' },
	dateOfBirth: { type: DataTypes.DATE, defaultValue: null, required: false },
	dateOfRegistration: {
		type: DataTypes.DATE,
		defaultValue: null,
		required: false,
	},
	password: { type: DataTypes.STRING(255), defaultValue: '', required: true },
	slug: { type: DataTypes.STRING, defaultValue: '', required: true },
	activationLink: { type: DataTypes.STRING, defaultValue: '' },
	phone: { type: DataTypes.STRING(100), defaultValue: '', required: false },
	driverRate: { type: DataTypes.FLOAT, defaultValue: null, required: false },
	dispatcherCommission: {
		type: DataTypes.FLOAT,
		defaultValue: null,
		required: false,
	},
	driverResident: { type: DataTypes.TEXT, required: false },
	driverAlcotest: {
		type: DataTypes.STRING(255),
		defaultValue: 'placeholder-bg.png',
	},
	driverContract: {
		type: DataTypes.STRING(255),
		defaultValue: 'placeholder-bg.png',
	},
	driverLicense: {
		type: DataTypes.STRING(255),
		defaultValue: 'placeholder-bg.png',
	},
	notes: { type: DataTypes.TEXT, unique: false },
	userStatus: { type: DataTypes.BOOLEAN, defaultValue: false, unique: false },
	createdAt: {
		allowNull: false,
		type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
	},
	updatedAt: {
		allowNull: false,
		type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
	},
});

module.exports = {
	User,
	DriverType,
	UserRole,
	DriverStatus,
	UserAssigned,
	Endorsements,
	UserEndorsements,
};
