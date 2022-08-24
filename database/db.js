const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');
module.exports = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
	dialect: 'postgres',
	dialectOptions: {
		charset: 'utf8',
	},
	ssl: {
		rejectUnauthorized: true,
	},
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	logging: (msg) => logger.info(msg),
	debug: false,
	// logging: process.env.NODE_ENV !== 'production',
});
