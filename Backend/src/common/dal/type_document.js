const models = require('cccommon/models/internaldb');

async function getTypeDocument() {
    try {
        const state = await models.TypeDocument.findAll();
        return state;
    } catch (error) {
        throw new Error(`Error getting states: ${error.message}`);
    }
}

async function getTypeDocumentById(id_type_doc) {
    try {
        const typeDocument = await models.TypeDocument.findOne({
            where: {
                id_type_document: id_type_doc
            }
        });
        return typeDocument;
    } catch (error) {
        throw new Error(`Error getting type document by ID: ${error.message}`);
    }
}

module.exports = {
    getTypeDocument,
    getTypeDocumentById
};
