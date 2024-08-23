const models = require('cccommon/models/internaldb');
const { Op } = require('sequelize'); // Importa Op de sequelize

//Get purchase options
async function getPurchaseOptions() {
    try {
        const purchaseOptions = await models.PurchaseOptions.findAll();
        return purchaseOptions;
    }
    catch (error) {
        throw new Error(`Error getting purchase options: ${error.message}`);
    }
}

//Get payment options
async function getPaymentOptions() {
    try {
        const paymentOptions = await models.PaymentOptions.findAll();
        return paymentOptions;
    }
    catch (error) {
        throw new Error(`Error getting payment options: ${error.message}`);
    }
}

//Create a purchase
async function createPurchase(purchaseData) {
    try {
        const newPurchase = models.Purchase.build(purchaseData);
        const savedPurchase = await newPurchase.save();
        return savedPurchase;
    }
    catch (error) {
        throw new Error(`Error creating purchase: ${error.message}`);
    }
}

//Update a purchase
async function updatePurchase(purchaseData) {
    try {
        const updatedPurchase = await models.Purchase.update(purchaseData, { where: { id_buyer: purchaseData.id_buyer } });
        return updatedPurchase;
    }
    catch (error) {
        throw new Error(`Error updating purchase: ${error.message}`);
    }
}

//Update id_purchase_status using id_purchase
async function updatePurchaseStatusByIdPurchase(id_purchase, id_purchase_status) {
    try {
        const updatedPurchase = await models.Purchase.update({ id_purchase_status: id_purchase_status }, { where: { id_purchase: id_purchase } });
        return updatedPurchase;
    }
    catch (error) {
        throw new Error(`Error updating purchase: ${error.message}`);
    }
}

//Get purchases by id_user
async function getPurchasesByIdUser(id_buyer) {
    try {

        const purchases = await models.Purchase.findAll({
            attributes: ['id_purchase', 'id_seller', 'id_lot', 'purchase_quantity', 'shipping_address', 'additional_notes', 'purchase_created_at', 'purchase_updated_at', 'purchase_deleted_at'],
            include: [
                {
                    model: models.PurchaseOptions,
                },
                {
                    model: models.ShippingOptions,
                }
            ],
            where: { id_buyer: id_buyer }
        });
        return purchases;
    }
    catch (error) {
        throw new Error(`Error getting purchases by id_buyer: ${error.message}`);
    }
}

async function getPurchasesByIdUserAndIdLot(id_buyer, id_lot) {
    try {

        const purchases = await models.Purchase.findAll({
            attributes: ['id_purchase', 'id_seller', 'id_lot', 'purchase_quantity', 'shipping_address', 'additional_notes', 'purchase_created_at', 'purchase_updated_at', 'purchase_deleted_at'],
            include: [
                {
                    model: models.PurchaseOptions,
                },
                {
                    model: models.ShippingOptions,
                }
            ],
            where: {
                id_buyer: id_buyer,
                id_lot: id_lot
            }
        });
        return purchases;
    }
    catch (error) {
        throw new Error(`Error getting purchases by id_buyer: ${error.message}`);
    }
}

async function getPurchasesByIdLot(id_lot) {
    try {

        const purchases = await models.Purchase.findAll({
            attributes: ['id_purchase', 'id_seller', 'id_lot', 'purchase_quantity', 'shipping_address', 'additional_notes', 'purchase_created_at', 'purchase_updated_at', 'purchase_deleted_at', "id_purchase_status"],
            include: [
                {
                    model: models.PurchaseOptions,
                },
                {
                    model: models.ShippingOptions,
                }
            ],
            where: {
                id_lot: id_lot
            }
        });
        return purchases;
    }
    catch (error) {
        throw new Error(`Error getting purchases by id_buyer: ${error.message}`);
    }
}

async function getSimplePurchaseByIdPurchase(id_purchase) {
    try {
        const purchase = await models.Purchase.findOne({
            where: { id_purchase: id_purchase }
        });
        return purchase;
    }
    catch (error) {
        throw new Error(`Error getting purchase by id_purchase: ${error.message}`);
    }
}

//Get purchase by id_purchase
async function getPurchaseByIdPurchase(id_purchase) {
    try {
        const purchase = await models.Purchase.findOne({
            attributes: ['id_purchase', 'id_seller', 'purchase_quantity', 'purchase_created_at', 'shipping_address', 'additional_notes'],
            include: [
                {
                    model: models.Lots,

                    attributes: ['id_lot', 'lot_number'],

                    include: [

                        {
                            model: models.CoffeeProfile,
                        },
                        {
                            model: models.CoffeeVariations
                        },
                        {
                            model: models.RoastingType
                        },
                        {
                            model: models.LotPhoto,
                        },
                        {
                            model: models.LotSummary,
                        },
                        {
                            model: models.LotQuantity,
                            include: [{ model: models.Associations }]
                        },
                        {
                            atributtes: ['price_per_kilo'],
                            model: models.LotQuantity,
                        }
                    ],

                },
                {
                    model: models.User, as: 'Buyer', attributes: ['id_user', 'user_name', 'user_username', 'user_profile_photo', 'id_state'],
                },
                {
                    model: models.User, as: 'Seller', attributes: ['id_user', 'user_name', 'user_username', 'user_profile_photo'],
                }
            ],
            where: { id_purchase: id_purchase }
        });
        return purchase;

    }
    catch (error) {
        throw new Error(`Error getting purchase by id_purchase: ${error.message}`);
    }
}

//Get purchase by id_seller
async function getPurchaseByIdSellerInProccess(id_seller) {
    try {
        const purchase = await models.Purchase.findAll({
            attributes: ['id_purchase', 'purchase_quantity'],
            include: [
                {
                    model: models.Lots,
                    attributes: ['id_lot', 'lot_number'],
                    include: [
                        {
                            model: models.CoffeeVariations,
                        },
                        {
                            model: models.CoffeeProfile,
                        },
                        {
                            model: models.RoastingType,
                        },

                    ],
                },
                {
                    model: models.User, as: 'Buyer', attributes: ['id_user', 'user_name', 'user_username', 'user_profile_photo', 'id_state'],
                },
                {
                    model: models.PurchaseOptions,
                },
                {
                    model: models.ShippingOptions,
                }
            ],
            where: { id_seller: id_seller, id_purchase_status: 2 }
        });
        return purchase;
    }
    catch (error) {
        throw new Error(`Error getting purchase by id_seller: ${error.message}`);
    }
}

//Get purchases by id_user from Lots model
async function getPurchasesByIdUserFromLots(id_buyer) {
    try {
        const purchases = await models.Purchase.findAll({
            attributes: ['id_purchase', 'id_seller', 'id_buyer', 'purchase_quantity', 'purchase_at', 'shipping_address', 'additional_notes'],
            include: [
                {
                    attributes: ['id_lot'],
                    model: models.Lots,
                    include: [
                        {
                            model: models.Farms,
                            where: { id_user: id_buyer }
                        }
                    ],
                },
                {
                    model: models.PaymentOptions,
                },
                {
                    model: models.PurchaseOptions,
                },
                {
                    model: models.ShippingOptions,
                }
            ],
        });

        const purchaseOrders = [];
        purchases.forEach(purchase => {
            const id_purchase = purchase.dataValues.id_purchase;
            const buyer = purchase.dataValues.id_buyer;
            const seller = purchase.dataValues.id_seller;
            const quantity = purchase.dataValues.purchase_quantity;
            const purchase_date = purchase.dataValues.purchase_at;
            const shipping_address = purchase.dataValues.shipping_address;
            const additional_notes = purchase.dataValues.additional_notes;
            const id_lot = purchase.dataValues.Lot.dataValues.id_lot;
            const id_farms = purchase.dataValues.Lot.dataValues.Farm.dataValues.id_farms;
            const owner = purchase.dataValues.Lot.dataValues.Farm.dataValues.id_user;
            const PaymentOption = purchase.dataValues.PaymentOption;
            const PurchaseOption = purchase.dataValues.PurchaseOption;
            const ShippingOption = purchase.dataValues.ShippingOption;

            const purchaseOrder = {
                id_purchase,
                buyer,
                seller,
                quantity,
                purchase_date,
                shipping_address,
                additional_notes,
                id_lot,
                id_farms,
                owner,
                PaymentOption,
                PurchaseOption,
                ShippingOption
            };
            purchaseOrders.push(purchaseOrder);
        });

        return purchaseOrders;
    }
    catch (error) {
        throw new Error(`Error getting purchases by id_buyer: ${error.message}`);
    }
}

//Get status of purchase by id_user
async function getPurchaseStatusByIdUser(id_user) {
    try {
        const purchases = await models.Purchase.findAll({

            where: {
                [Op.or]: [
                    { id_buyer: id_user },
                    { id_seller: id_user }
                ]
            },

            include: [
                {
                    model: models.User, as: 'Seller', attributes: ['id_user', 'user_name']
                },
                {
                    model: models.User, as: 'Buyer', attributes: ['id_user']
                },
                {
                    model: models.PurchaseOptions, attributes: ['status_name']
                },
                {
                    model: models.Lots,
                    attributes: ['id_lot', 'lot_number'],
                    include: [
                        {
                            atributtes: ['price_per_kilo'],
                            model: models.LotQuantity,
                        }

                    ],

                },

            ],

        });

        //Format the data
        const result = purchases.map(purchase => {
            return {
                id_purchase: purchase.dataValues.id_purchase,
                tipo: purchase.dataValues.id_buyer === id_user ? 'compra' : 'venta',
                vendedor: purchase.dataValues.Seller.dataValues.user_name,
                fecha: purchase.dataValues.purchase_created_at,
                cantidad: purchase.dataValues.purchase_quantity,
                precio: purchase.dataValues.Lot.dataValues.LotQuantity.dataValues.price_per_kilo,
                lot_number: purchase.dataValues.Lot.dataValues.lot_number,
                estado: purchase.dataValues.PurchaseOption.dataValues.status_name,

            }
        });
        return result;
    }
    catch (error) {
        throw new Error(`Error getting purchase status by id_user: ${error.message}`);
    }
}

async function getPurchaseDetails(id_lot, purchase_quantity) {
    try {
        const lotDetails = await models.LotQuantity.findOne({
            where: {
                id_lot: id_lot
            },
            attributes: ['total_quantity', 'price_per_kilo']
        });

        if (!lotDetails) {
            throw new Error(`Error getting lot details: ${error.message}`);
        }

        const totalQuantity = lotDetails.dataValues.total_quantity;
        const pricePerKilo = lotDetails.dataValues.price_per_kilo;

        //Calculate total price
        const totalPrice = purchase_quantity * pricePerKilo;

        //Verify if the input quantity is less than the total quantity
        if (purchase_quantity > totalQuantity) {
            throw new Error(`The quantity is greater than the total quantity`);
        }

        return totalPrice;

    }
    catch (error) {
        throw new Error(`Error getting purchase details: ${error.message}`);
    }
}

module.exports = {
    getPurchaseOptions,
    getPaymentOptions,
    createPurchase,
    updatePurchase,
    getPurchasesByIdUser,
    getPurchasesByIdUserFromLots,
    updatePurchaseStatusByIdPurchase,
    getPurchaseByIdSellerInProccess,
    getPurchaseStatusByIdUser,
    getPurchaseByIdPurchase,
    getPurchaseDetails,
    getPurchasesByIdUserAndIdLot,
    getSimplePurchaseByIdPurchase,
    getPurchasesByIdLot
};
