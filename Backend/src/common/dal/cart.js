const models = require('cccommon/models/internaldb');
const { app_url } = require('cccommon/config');

async function saveCartData(dataCart) {
    try {

        const savedCartData = await models.Cart.build(dataCart);
        await savedCartData.save();
        return savedCartData;
    } catch (err) {
        throw new Error(`Error saving cart data: ${err.message}`);
    };
};

async function saveCartCourseData(dataCartCourse) {
    try {
        const savedCartCourseData = await models.CartCourse.create(dataCartCourse);
        return savedCartCourseData;
    } catch (err) {
        throw new Error(`Error saving cart course data: ${err.message}`);
    }
}

async function getCartDataByIdUser(id_buyer) {
    try {
        const cartData = await models.Cart.findAll({
            attributes: ['id_cart', 'id_buyer', 'id_seller'],
            include: [
                {
                    attributes: ['id_lot', 'lot_number', 'id_farm'],
                    model: models.Lots,
                    include: [
                        {
                            model: models.CoffeeVariations
                        },
                        {
                            model: models.CoffeeProfile
                        },
                        {
                            model: models.LotQuantity,
                            attributes: ['id_lot_quantity', 'id_lot', 'total_quantity', 'samples_quantity', 'id_association', 'price_per_kilo'],
                            include: [
                                {
                                    model: models.Associations
                                },
                            ]
                        },
                        {
                            model: models.LotPhoto
                        },
                        {
                            model: models.RoastingType
                        },
                        {
                            model: models.LotSummary
                        }
                    ],
                    required: true,
                }
            ],
            where: {
                id_buyer: id_buyer
            },
        });

        return cartData;

    } catch (err) {
        throw new Error(`Error getting cart data by id_buyer: ${err.message}`);
    }
}

async function getCartDataByIdCart(id_cart) {
    try {
        const cartData = await models.Cart.findOne({
            where: {
                id_cart: id_cart
            },
        });

        return cartData;

    } catch (err) {
        throw new Error(`Error getting cart data by id_cart: ${err.message}`);
    }
}

async function getCartCourseByIdCart(id_cart_course) {
    try {
        const cartData = await models.CartCourse.findOne({
            where: {
                id_cart_course: id_cart_course
            },
        });

        return cartData;

    } catch (err) {
        throw new Error(`Error getting cart data by id_cart: ${err.message}`);
    }
}

async function deleteCartDataByIdCart(id_cart) {
    try {
        const cartData = await models.Cart.destroy({
            where: {
                id_cart: id_cart
            },
        });

        return cartData;

    } catch (err) {
        throw new Error(`Error deleting cart data by id_cart: ${err.message}`);
    }
}

async function deleteCartDataByIdCartCourse(id_cart) {
    try {
        const cartData = await models.CartCourse.destroy({
            where: {
                id_cart_course: id_cart
            },
        });

        return cartData;

    } catch (err) {
        throw new Error(`Error deleting cart data by id_cart: ${err.message}`);
    }
}

async function updateCartDataByIdCart(dataCart) {
    try {
        const cartData = await models.Cart.update(dataCart, {
            where: {
                id_cart: dataCart.id_cart
            },
        });

        return cartData;

    } catch (err) {
        throw new Error(`Error updating cart data by id_cart: ${err.message}`);
    }
}

async function deleteCartDataByIdUser(id_buyer, id_lot) {
    try {
        const cartData = await models.Cart.destroy({
            where: {
                id_buyer: id_buyer,
                id_lot: id_lot
            },
        });

        return cartData;

    } catch (err) {
        throw new Error(`Error deleting cart data by id_buyer: ${err.message}`);
    }
}

async function getCartItemCounts(id_buyer) {
    try {
        const cartData = await models.Cart.findAll({
            where: {
                id_buyer: id_buyer
            },
        });

        return cartData.length;

    } catch (err) {
        throw new Error(`Error getting cart data by id_buyer: ${err.message}`);
    }
}

async function getCartDataByIdUserIdLot(id_seller, id_buyer, id_lot) {

    try {
        const cartData = await models.Cart.findAll({
            where: {
                id_seller: id_seller,
                id_buyer: id_buyer,
                id_lot: id_lot
            },
        });

        return cartData;

    } catch (err) {
        throw new Error(`Error getting cart data by id_buyer and id_lot: ${err.message}`);
    }
}

async function getCartDataByIdLot(id_lot) {

    try {
        const cartData = await models.Cart.findAll({
            where: {
                id_lot: id_lot
            },
        });

        return cartData;

    } catch (err) {
        throw new Error(`Error getting cart data by id_buyer and id_lot: ${err.message}`);
    }
}

async function getCartDataByIdUserIdCourse(id_seller, id_buyer, id_course) {

    try {
        const cartData = await models.CartCourse.findAll({
            where: {
                id_seller: id_seller,
                id_buyer: id_buyer,
                id_course: id_course
            },
        });

        return cartData;

    } catch (err) {
        throw new Error(`Error getting cart data by id_buyer and id_lot: ${err.message}`);
    }
}

async function updateCartDataByIdUser(dataCart) {
    try {
        const cartData = await models.Cart.update(dataCart, {
            where: {
                id_buyer: dataCart.id_buyer
            },
        });

        return cartData;

    } catch (err) {
        throw new Error(`Error updating cart data by id_buyer: ${err.message}`);
    }
}

async function setIsInPurchaseByIdCart(id_cart) {
    try {
        const cartData = await models.Cart.update({ is_in_purchase: true }, {
            where: {
                id_cart: id_cart
            },
        });

        return cartData;

    } catch (err) {
        throw new Error(`Error updating cart data by id_cart: ${err.message}`);
    }
}

async function setIsInPurchaseByIdCartCourse(id_cart_course) {
    try {
        const cartData = await models.CartCourse.update({ is_in_purchase: true }, {
            where: {
                id_cart_course: id_cart_course
            },
        });

        return cartData;

    } catch (err) {
        throw new Error(`Error updating cart data by id_cart: ${err.message}`);
    }
}

async function deleteCartCourseDataByIdUser(id_buyer, id_course) {
    try {
        const result = await models.CartCourse.destroy({
            where: {
                id_buyer: id_buyer,
                id_course: id_course
            },
        });
        return result;
    } catch (err) {
        throw new Error(`Error deleting cart course data: ${err.message}`);
    }
}

// En Backend/src/common/dal/cart.js
async function getCartCoursesDataByIdUser(id_buyer) {
    try {
        const cartCoursesData = await models.CartCourse.findAll({
            where: { id_buyer: id_buyer },
            include: [{
                model: models.Course,
                required: true,
                attributes: ['id_course', 'course_title', 'course_description', 'course_price', 'course_photo', 'course_status'],
            }],
            attributes: ['id_cart_course', 'is_in_purchase', 'cart_created_at', 'cart_updated_at'],
        });

        return cartCoursesData.map(cartCourse => {
            const cartCourseJson = cartCourse.toJSON();
            if (cartCourseJson.Course.course_photo) {
                cartCourseJson.Course.course_photo = `${app_url()}${cartCourseJson.Course.course_photo}`;
            }
            return cartCourseJson;
        });
    } catch (err) {
        throw new Error(`Error retrieving cart courses data for user ID ${id_buyer}: ${err.message}`);
    }
}


module.exports = {
    saveCartData,
    getCartDataByIdUser,
    getCartDataByIdCart,
    deleteCartDataByIdCart,
    updateCartDataByIdCart,
    deleteCartDataByIdUser,
    getCartItemCounts,
    updateCartDataByIdUser,
    getCartDataByIdUserIdLot,
    setIsInPurchaseByIdCart,
    saveCartCourseData,
    getCartCourseByIdCart,
    setIsInPurchaseByIdCartCourse,
    getCartDataByIdUserIdCourse,
    deleteCartCourseDataByIdUser,
    getCartCoursesDataByIdUser,
    getCartDataByIdLot,
    deleteCartDataByIdCartCourse
};



