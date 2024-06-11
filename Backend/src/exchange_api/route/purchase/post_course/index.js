const purchaseDal = require('cccommon/dal/purchase');
const cartCourseDal = require('cccommon/dal/cart');
const courseDal = require('cccommon/dal/course'); // Asume que este DAL existe y tiene un método getCourseDetails
const appErr = require('this_pkg/error');
const axios = require('axios');
const { url_apify, url_redirect, apify_public_key, apify_private_key } = require('cccommon/config');

exports.handler = async (req, res) => {
    const successStatus = 200;

    const { shipping_address, additional_notes, id_shipping_option, courseData } = req.body;

    if (!courseData || !Array.isArray(courseData)) {
        appErr.send(req, res, 'validation_error', 'missing course data or not an array');
        return;
    }
    console.log({courseData})
    let totalPrice = 0;
    let purchaseResponses = [];

    try {
        for (let row of courseData) {
            const { id_cart_course } = row;
            console.log({id_cart_course})

            const cartCourse = await cartCourseDal.getCartCourseByIdCart(id_cart_course);
            if (!cartCourse) {
                appErr.send(req, res, 'validation_error', `Cart course not found with id: ${id_cart_course}`);
                return;
            }

            await cartCourseDal.setIsInPurchaseByIdCartCourse(id_cart_course);

            const courseDetails = await courseDal.getCourseById(cartCourse.id_course);
            if (!courseDetails) {
                appErr.send(req, res, 'validation_error', `Course not found with id: ${cartCourse.id_course}`);
                return;
            }

            const priceForThisCourse = courseDetails.price * 1;
            totalPrice += priceForThisCourse;

            const purchase = await purchaseDal.createPurchase({
                id_seller: cartCourse.id_seller,
                id_buyer: cartCourse.id_buyer,
                id_course: cartCourse.id_course,
                id_shipping_option,
                shipping_address,
                additional_notes,
                price: priceForThisCourse
            });

            purchaseResponses.push(purchase);
        }

        const base64Credentials = Buffer.from(`${PUBLIC_KEY}:${PRIVATE_KEY}`).toString('base64');

        var config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: `${url_apify}/login`,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${base64Credentials}`
          },
          data: dataInput
        };
    
        response = await axios(config);
        apify_token = response.data.token;
        const invoice_name = Math.floor(Math.random() * 1000000000) + 1;
    
        dataInput = {
          name: "New Checkout",
          invoice: invoice_name.toString(),
          description: `Compra de los lotes: ${cartData.map((item) => item.id_lot).join(', ')}`,
          currency: "cop",
          amount: totalPrince.toString(),
          country: "CO",
          test: "true",
          ip: "186.97.212.162",
          response: `${url_redirect}/1`,
          acepted: `${url_redirect}/1`,
          rejected: `${url_redirect}/2`,
          pending: `${url_redirect}/3`,
          extra1: `[${cartData.map((item) => item.id_cart).join(',')}]`,
          extra2: `[${PurchaseData.map((item) => item.id_purchase).join(',')}]`,
          uniqueTransactionPerBill: 'true'
        };
    
    
        config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: `${url_apify}/payment/session/create`,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apify_token}`
          },
          data: JSON.stringify(dataInput)
        };
    
    
        response = await axios(config);
    
        if (response.data.success == false) {
          appErr.send(req, res, 'validation_error', 'Error creating session');
          return;
        }

        res.status(successStatus).send({
            message: 'Courses purchased successfully',
            purchases: purchaseResponses.map(purchase => ({
                id_purchase: purchase.id,
                id_course: purchase.id_course,
                totalPrice: purchase.price,
                session_id: response.data.data.sessionId
            }))
        });
    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'Failed to complete course purchase');
    }
};
