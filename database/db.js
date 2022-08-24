const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');

module.exports = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
	dialect: 'postgres',
	dialectOptions: {
		charset: 'utf8',
	},
	host: process.env.DB_HOST,
	logging: (msg) => (process.env.NODE_ENV !== 'production' ? logger.info(msg) : false),
	// logging: process.env.NODE_ENV !== 'production',
});
