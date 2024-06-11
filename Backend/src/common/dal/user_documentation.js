const models = require('cccommon/models/internaldb');


// Fill in the fields for the new user in UserDocumentation using models.UserDocumentation.build
async function createUserDocumentation(id_user, identification_document, rut_identification, tax_identification) {
    try {
        const newUserDocumentation = models.UserDocumentation.build({ id_user: id_user, user_identification_document: identification_document, user_rut_identification: rut_identification, user_tax_identification: tax_identification });
        const savedUserDocumentation = await newUserDocumentation.save();
        return savedUserDocumentation;
    } catch (error) {
        throw new Error(`Error creating UserDocumentation: ${error.message}`);
    }
}

// Update the fileds for the user in UserDocumentation using models.UserDocumentation.update using user_id
async function updateUserDocumentation(id_user, identification_document, rut_identification, tax_identification) {
    try {
        const updatedUserDocumentation = await models.UserDocumentation.update({ user_identification_document: identification_document, user_rut_identification: rut_identification, user_tax_identification: tax_identification }, { where: { id_user: id_user } });
        return updatedUserDocumentation;
    } catch (error) {
        throw new Error(`Error updating UserDocumentation: ${error.message}`);
    }
}


async function getUserDocumentationById(id_user) {
    try {
        const user = await models.UserDocumentation.findOne({
            where: {
                id_user: id_user
            },
        });

        return user;

    } catch (error) {
        throw new Error(`Error getting user by id: ${error.message}`);
    }
};



module.exports = {
    createUserDocumentation,
    getUserDocumentationById,
    updateUserDocumentation
};

  