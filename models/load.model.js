const sequelize = require('../database/db');
const { DataTypes } = require('sequelize');

const LoadType = sequelize.define(
	'load_type',
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

const LoadStatus = sequelize.define(
	'load_status',
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

const Load = sequelize.define('load', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	rate: { type: DataTypes.FLOAT, defaultValue: null, required: false },
	mileage: { type: DataTypes.FLOAT, defaultValue: null, required: false },
	amount: { type: DataTypes.FLOAT, defaultValue: null, required: false },
	pickUpLocation: {
		type: DataTypes.STRING(1000),
		defaultValue: '',
		required: false,
	},
	pickUpDate: { type: DataTypes.DATE, defaultValue: null, required: false },
	pickUpAppointment: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
		required: false,
	},
	pickUpNote: { type: DataTypes.TEXT },
	deliveryLocation: {
		type: DataTypes.STRING(1000),
		defaultValue: '',
		required: false,
	},
	deliveryDate: { type: DataTypes.DATE, defaultValue: null, required: false },
	deliveryAppointment: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
		required: false,
	},
	deliveryNote: { type: DataTypes.TEXT },
	stops: { type: DataTypes.INTEGER, defaultValue: null, required: false },
	expenses: { type: DataTypes.FLOAT, defaultValue: null, required: false },
	mc: { type: DataTypes.STRING(1000), unique: false },
	notes: { type: DataTypes.TEXT },
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
	Load,
	LoadType,
	LoadStatus,
};
