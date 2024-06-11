// http.js
const upload = require('./upload');

exports.uploadMultipleWrapper = (fields) => {

    return (handler) => {
        return (req, res, next) => {
            upload.fields(fields)(req, res, (err) => {
                if (err) {
                    return res.status(500).json({
                        error: err.message
                    });
                }
                handler(req, res, next);
            });
        };
    };
};