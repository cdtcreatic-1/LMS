const cartCourseDal = require('cccommon/dal/cart');
const courseDal = require('cccommon/dal/course');
const appErr = require('this_pkg/error');
const axios = require('axios');
const url_apify = require('cccommon/config').url_apify_api();
const url_redirect = require('cccommon/config').url_redirect();
const PUBLIC_KEY = require('cccommon/config').apify_public_key();
const PRIVATE_KEY = require('cccommon/config').apify_private_key();
var dataInput = '';
var apify_token = '';

exports.handler = async (req, res) => {
  const successStatus = 200;

  const { shipping_address, additional_notes, id_shipping_option, courseData } = req.body;

  if (!courseData || !Array.isArray(courseData)) {
    appErr.send(req, res, 'validation_error', 'missing course data or not an array');
    return;
  }

  const id_purchase_status = 1


  let response;
  let cartData = [];
  let purchaseResponses = [];
  let id_user;
  let id_course;

  try {
    let totalPrice = 0;

    for (let row of courseData) {
      const { id_cart_course } = row;

      const cartCourse = await cartCourseDal.getCartCourseByIdCart(id_cart_course);
      id_user = cartCourse.id_buyer;
      id_course = cartCourse.id_course;
      if (!cartCourse) {
        appErr.send(req, res, 'validation_error', `Cart course not found with id: ${id_cart_course}`);
        return;
      }
      const singleCartJson = cartCourse.toJSON();
      /*if (singleCartJson.is_in_purchase) {
        appErr.send(req, res, 'validation_error', `Cart ${singleCartJson.id_cart_course} is already in purchase`);
        return;
      }*/

      const courseDetails = await courseDal.getCourseById(cartCourse.id_course);
      if (!courseDetails) {
        appErr.send(req, res, 'validation_error', `Course not found with id: ${cartCourse.id_course}`);
        return;
      }

      const priceForThisCourse = courseDetails.course_price;
      totalPrice += priceForThisCourse;

      cartData.push(singleCartJson);

      await cartCourseDal.setIsInPurchaseByIdCartCourse(id_cart_course);

      purchaseResponses.push({
        id_seller: cartCourse.id_seller,
        id_buyer: cartCourse.id_buyer,
        id_course: cartCourse.id_course,
        id_shipping_option,
        id_purchase_status,
        shipping_address,
        additional_notes,
        price: priceForThisCourse
      });
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
      description: `Compra del o los cursos: ${cartData.map((item) => item.id_course).join(', ')}`,
      currency: "cop",
      amount: totalPrice.toString(),
      country: "CO",
      test: "true",
      ip: "186.97.212.162",
      response: `${url_redirect}/1`,
      acepted: `${url_redirect}/1`,
      rejected: `${url_redirect}/2`,
      pending: `${url_redirect}/3`,
      extra1: `[${cartData.map((item) => item.id_cart_course).join(',')}]`,
      extra2: `[${purchaseResponses.map((item) => item.id_purchase_course).join(',')}]`,
      extra3: `${id_course}`,
      extra4: `${id_user}`,
      extra5: `${id_shipping_option}`,
      extra6: `${shipping_address}`,
      extra7: `${additional_notes}`,
      extra8: `${totalPrice}`,
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
