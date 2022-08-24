const ApiError = require('../exceptions/ApiError');

module.exports = function (err, req, res, next) {
	if (err instanceof ApiError) {
		return res.status(err.status).json({ message: err.message, errors: err.errors });
	} else {
		next(err);
	}
	return res.status(500).json({ message: 'Server error' });
};
