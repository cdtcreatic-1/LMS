const purchaseDal = require('cccommon/dal/purchase')
const appErr = require('this_pkg/error');


exports.handler = async (req, res) => {
    let purchaseData;
    const successStatus = 201;
  
    const { id_purchase, id_purchase_status } = req.body;
    const valErrs = [];

    
    const requiredFields = ['id_purchase', 'id_purchase_status'];
  
    requiredFields.forEach(field => {
      if (!req.body[field]) {
        valErrs.push({ [field]: 'missing' });
      }
    });
  
    if (valErrs.length) {
      appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
      return;
    }
  
    const purchase_at = new Date();
  
    try {
      purchaseData = await purchaseDal.updatePurchaseStatusByIdPurchase( id_purchase, id_purchase_status);
  
    } catch (err) {
      appErr.handleRouteServerErr(req, res, err, 'failed to updated purchase');
    }
  
    res.status(successStatus).send({
      message: 'purchase updated successfully',
      purchaseData: purchaseData
    });
  };