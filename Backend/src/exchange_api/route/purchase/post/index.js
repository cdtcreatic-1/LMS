const purchaseDal = require('cccommon/dal/purchase')
const lotQuantityDal = require('cccommon/dal/lot_quantity');
const cartDal = require('cccommon/dal/cart')
const appErr = require('this_pkg/error');
const axios = require('axios');
const url_apify = require('cccommon/config').url_apify_api();
const url_redirect = require('cccommon/config').url_redirect();
const PUBLIC_KEY = require('cccommon/config').apify_public_key();
const PRIVATE_KEY = require('cccommon/config').apify_private_key();
var dataInput = '';
var apify_token = '';
let purchase_id = 0;


exports.handler = async (req, res) => {


  const successStatus = 200;

  const requiredFieldsCarts = ['id_cart', 'purchase_quantity'];

  const { shipping_address, additional_notes, id_shipping_option, data } = req.body;


  if (!data) {
    appErr.send(req, res, 'validation_error', 'missing data');
    return;
  }

  if (!Array.isArray(data)) {
    appErr.send(req, res, 'validation_error', 'data must be an array');
    return;
  }

  const valErrsCart = [];
  data.forEach((purchase, index) => {
    requiredFieldsCarts.forEach(field => {
      if (!purchase[field]) {
        valErrsCart.push({ [field]: `missing in index ${index}` });
      }
    });
  });


  if (valErrsCart.length) {
    appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrsCart));
    return;
  }



  const valErrs = [];

  const id_purchase_status = 1
  req.body.id_purchase_status = id_purchase_status;

  const requiredFields = ['id_purchase_status', 'shipping_address', 'additional_notes', 'id_shipping_option'];

  requiredFields.forEach(field => {
    if (!req.body[field]) {
      valErrs.push({ [field]: 'missing' });
    }
  });

  if (valErrs.length) {
    appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
    return;
  }




  let response;
  let cartData = [];
  let PurchaseData = [];
  try {
    let totalPrince = 0;


    for (let row of data) {

      const singleCart = await cartDal.getCartDataByIdCart(row.id_cart);

      if (!singleCart) {
        appErr.send(req, res, 'validation_error', 'Cart not found');
        return;
      }

      const singleCartJson = singleCart.toJSON();

      /*if (singleCartJson.is_in_purchase) {
        appErr.send(req, res, 'validation_error', `Cart ${singleCartJson.id_cart} is already in purchase`);
        return;
      }*/

      totalPrince += await purchaseDal.getPurchaseDetails(singleCart.id_lot, row.purchase_quantity);

      cartData.push(singleCartJson);

      await cartDal.setIsInPurchaseByIdCart(row.id_cart);

      /////////////////////////////////////////////////////////////////////
      row.purchase_quantity = row.is_sample === true ? 1 : row.purchase_quantity;
      const singlePurchase = await purchaseDal.createPurchase({ id_seller: singleCartJson.id_seller, id_buyer: singleCartJson.id_buyer, id_lot: singleCartJson.id_lot, is_sample: row.is_sample, purchase_quantity: row.purchase_quantity, id_shipping_option, id_purchase_status, shipping_address, additional_notes });
      purchase_id = singlePurchase.id_purchase
      if (!singlePurchase) {
        await updatePurchaseStatusOnError(purchase_id);
        appErr.send(req, res, 'validation_error', 'Error creating purchase');
        return;
      }

      PurchaseData.push(singlePurchase.toJSON());

      const lotQuantityData = await lotQuantityDal.getLotQuantityByIdLot(singleCartJson.id_lot);
      const currentTotalQuantity = lotQuantityData.total_quantity;
      const newTotalQuantity = currentTotalQuantity - row.purchase_quantity;
      await lotQuantityDal.updateLotQuantityByIdLot(singleCartJson.id_lot, newTotalQuantity);

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

  } catch (err) {
    await updatePurchaseStatusOnError(purchase_id);
    appErr.handleRouteServerErr(req, res, err, 'failed to create purchase');
    return;
  }

  res.status(successStatus).send({
    message: 'purchase created successfully',
    session_id: response.data.data.sessionId
  });
};

async function updatePurchaseStatusOnError(purchaseId) {
  if(purchaseId == 0){
    return
  }

  try {
      const purchaseUpdateData = { id_purchase_status: 3 };
      const updatedPurchase = await purchaseDal.updatePurchase({ purchaseId, ...purchaseUpdateData });
      if (!updatedPurchase) {
        appErr.send(req, res, 'validation_error', 'Error creating purchase');
        return;
      }
  } catch (error) {
      console.error('Failed to update purchase status:', error);
  }
}