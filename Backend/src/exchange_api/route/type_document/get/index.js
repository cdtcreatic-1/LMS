const commonConfig = require('cccommon/config');
const typDocDal = require('cccommon/dal/type_document');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
    const id_type_doc = req.body.id_type_document;
    const successStatus = 200;

    const validationErrors = [];

    if (id_type_doc !== undefined) {
        const id = Number(id_type_doc);
        if (!Number.isInteger(id) || id < 1 || id > 4) {
            validationErrors.push({ id_type_document: 'id_type_document must be an integer between 1 and 4' });
        }
    }

    if (validationErrors.length) {
        appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(validationErrors));
        return;
    }

    try {
        let typeDocument;
        if (id_type_doc !== undefined) {
            typeDocument = await typDocDal.getTypeDocumentById(id_type_doc);
        } else {
            typeDocument = await typDocDal.getTypeDocument();
        }

        res.status(successStatus).send({
            message: 'Type Document information retrieved successfully',
            type_document: typeDocument
        });

    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to retrieve type document information');
        return;
    }
};
