const fs = require('fs');

class FileService {
	createDir(rootPath, dirName, userFolder = '') {
		let filePath;
		if (userFolder.length) {
			filePath = rootPath + '/' + userFolder + '/' + dirName;
		} else {
			filePath = rootPath + '/' + dirName;
		}

		if (!fs.existsSync(filePath)) {
			fs.mkdirSync(filePath);
		}
	}

	deleteDir(rootPath, dirName) {
		const filePath = rootPath + '/' + dirName;

		if (fs.existsSync(filePath)) {
			fs.rmdirSync(filePath, { recursive: true });
		}
	}

	saveFile(file, filePath, newFileName) {
		file.mv(filePath + '/' + newFileName);
	}

	deleteFile(rootPath, fileName) {
		const file = rootPath + '/' + fileName;
		console.log(file);
		if (fs.existsSync(file)) {
			fs.unlinkSync(file);
		}
	}
}

module.exports = new FileService();
