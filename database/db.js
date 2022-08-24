const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');

module.exports = new Sequelize(
	'postgresql://doadmin:AVNS_IfscbhH1CrD29zIEBoc@db-postgresql-fra1-01378-do-user-9664967-0.b.db.ondigitalocean.com:25060/defaultdb?sslmode=require',
	{}
);
// module.exports = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
// 	dialect: 'postgres',
// 	dialectOptions: {
// 		ssl: {
// 			require: true,
// 			rejectUnauthorized: false, // <<<<<<< YOU NEED THIS
// 		},
// 		charset: 'utf8',
// 	},
// 	// ssl: {
// 	// 	rejectUnauthorized: true,
// 	// },
// 	host: process.env.DB_HOST,
// 	port: +process.env.DB_PORT,
// 	logging: (msg) => logger.info(msg),
// 	debug: false,
// 	// logging: process.env.NODE_ENV !== 'production',
// });
