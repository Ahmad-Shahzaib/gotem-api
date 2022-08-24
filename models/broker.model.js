const sequelize = require('../database/db');
const { DataTypes } = require('sequelize');

const Broker = sequelize.define(
	'broker',
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

module.exports = {
	Broker,
};
