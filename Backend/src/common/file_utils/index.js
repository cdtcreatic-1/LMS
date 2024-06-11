const fs = require('fs');

const deleteFile = (filePath) => {

    if (!filePath) {
        return;
    }

    const files = fs.readdirSync((process.cwd() + '/uploads/'))


    //remove uploads/ from the path using replace
    filePath = filePath.replace('uploads/', '')


    if (!files.includes(filePath)) {
        return;
    }
    fs.unlink(process.cwd() + '/uploads/' + filePath, (err) => {
        if (err) {
            console.log(err);
        }
    });
};

module.exports = {
    deleteFile
};
