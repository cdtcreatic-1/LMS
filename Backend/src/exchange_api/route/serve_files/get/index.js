const appErr = require('this_pkg/error');
const path = require('path');
const fs = require('fs').promises;

exports.handler = async (req, res) => {

    const fileName = req.params.filename;

    if (!fileName) {
        appErr.send(req, res, 'not_found', 'Filename not found');
        return;
    }
    const filePath = path.join(__dirname, '../../../../exchange_api/uploads', fileName);

    try {

        const fileExists = await fs.access(filePath, fs.constants.F_OK).
            then(() => true)
            .catch(() => false);

        if (!fileExists) {
            appErr.send(req, res, 'not_found', 'File not found');
            return;
        }
        res.sendFile(filePath);
    } catch (error) {
        appErr.handleRouteServerErr(req, res, error, 'failed to get file');
        return;
    }
};