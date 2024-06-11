const models = require('cccommon/models/internaldb');

async function createPurchaseCourse(data) {
    try {
        const newPurchase = models.PurchaseCourse.build(data);
        const savedPurchase = await newPurchase.save();
        return savedPurchase;
    } catch (error) {
        throw new Error(`Error creating purchase course: ${error.message}`);
    }
}

async function getPurchaseCourseById(id_purchase_course) {
    try {
        return await models.PurchaseCourse.findByPk(id_purchase_course);
    } catch (error) {
        throw new Error(`Error retrieving purchase course by id: ${error.message}`);
    }
}

async function getPurchaseCourseByIdBuyer(id_buyer) {
    try {
        return await models.PurchaseCourse.findByPk(id_buyer);
    } catch (error) {
        throw new Error(`Error retrieving purchase course by id: ${error.message}`);
    }
}

async function getSimplePurchaseByIdPurchase(id_purchase_course) {
    try {
        const purchase = await models.PurchaseCourse.findOne({
            where: { id_purchase_course: id_purchase_course }
        });
        return purchase;
    }
    catch (error) {
        throw new Error(`Error getting purchase by id_purchase_course: ${error.message}`);
    }
}

async function updatePurchaseStatusByIdPurchase(id_purchase_course, id_purchase_status) {
    try {
        const updatedPurchase = await models.PurchaseCourse.update({ id_purchase_status: id_purchase_status }, { where: { id_purchase_course: id_purchase_course } });
        return updatedPurchase;
    }
    catch (error) {
        throw new Error(`Error updating purchase: ${error.message}`);
    }
}

async function getPurchasesCoursesByIdBuyer(id_buyer) {
    try {
        const purchases = await models.PurchaseCourse.findAll({ where: { id_buyer } });
        if (!purchases) {
            return [];
        }
        return purchases;
    } catch (error) {
        throw new Error(`Error retrieving purchase course by id: ${error.message}`);
    }
}

module.exports = {
    createPurchaseCourse,
    getPurchaseCourseById,
    getPurchaseCourseByIdBuyer,
    getPurchasesCoursesByIdBuyer,
    getSimplePurchaseByIdPurchase,
    updatePurchaseStatusByIdPurchase
};
