const fs = require('fs');
const fileExists = (filePath) => {
    try {
        return fs.existsSync(filePath);
    } catch (err) {
        return false;
    }
}

module.exports = {fileExists}