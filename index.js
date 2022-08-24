const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const compression = require('compression');
const fileUpload = require('express-fileupload');
const sequelize = require('./database/db');
const router = require('./routes');
const errorHandler = require('./middleware/logErrors.middleware');
const logErrors = require('./middleware/errorHandling.middleware');
const filePathMiddleware = require('./middleware/filePath.middleware');
const logger = require('./utils/logger');
const PORT = process.env.PORT;

const server = express();
server.use(cors());
server.use(compression());
server.use(fileUpload({}));
server.use(filePathMiddleware(path.resolve(__dirname, 'uploads')));
server.use(express.json());
server.use(
	morgan(':method :url :status :res[content-length] - :response-time ms', {
		stream: logger.stream,
	})
);
if (process.env.NODE_ENV === 'development') {
	server.use('/api', router);
	server.use(express.static(path.resolve(__dirname, 'uploads')));
} else if (process.env.NODE_ENV === 'production') {
	server.use('/api', router);
	server.use('/', express.static(path.join(__dirname, 'public')));
}

server.use(logErrors);
server.use(errorHandler);

const start = async () => {
	try {
		await sequelize.authenticate();
		// await sequelize.sync({ force: false, alter: true });
		await sequelize.sync({ force: false });
		logger.info('Drop and re-sync db...');
		server.listen(PORT, () => {
			logger.info(`Server started on port http://localhost:${PORT} !!! Happy Hacking :)`);
		});
	} catch (e) {
		logger.error(e);
	}
};

start();
