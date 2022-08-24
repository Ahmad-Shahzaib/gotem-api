const sequelize = require('../database/db');
const { DataTypes } = require('sequelize');

const Truck = sequelize.define('truck', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	truck_number: {
		type: DataTypes.STRING(255),
		unique: false,
		defaultValue: '',
		required: true,
	},
	truck_vin: {
		type: DataTypes.STRING(255),
		unique: false,
		defaultValue: '',
		required: true,
	},
	trailer_number: {
		type: DataTypes.STRING(255),
		unique: false,
		defaultValue: '',
		required: false,
	},
	trailer_vin: {
		type: DataTypes.STRING(255),
		unique: false,
		defaultValue: '',
		required: false,
	},
	year_of_issue: {
		type: DataTypes.DATEONLY,
		unique: false,
		defaultValue: null,
		required: true,
	},
	make: {
		type: DataTypes.STRING(255),
		unique: false,
		defaultValue: '',
		required: true,
	},
	model: {
		type: DataTypes.STRING(255),
		unique: false,
		defaultValue: '',
		required: true,
	},
	weight: {
		type: DataTypes.FLOAT,
		unique: false,
		defaultValue: null,
		required: true,
	},
	notes: { type: DataTypes.TEXT, unique: false },
	createdAt: {
		allowNull: false,
		type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
	},
	updatedAt: {
		allowNull: false,
		type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
	},
});

const TruckType = sequelize.define(
	'truck_type',
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

const TrailerLength = sequelize.define(
	'trailer_length',
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		length: {
			type: DataTypes.INTEGER,
			unique: false,
			defaultValue: null,
			required: true,
		},
	},
	{
		timestamps: false,
	}
);

const Equipment = sequelize.define(
	'equipment',
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

const TruckEquipment = sequelize.define(
	'truck_equipment',
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	},
	{
		// options
		timestamps: false,
	}
);

module.exports = {
	Truck,
	TruckType,
	TrailerLength,
	Equipment,
	TruckEquipment,
};
