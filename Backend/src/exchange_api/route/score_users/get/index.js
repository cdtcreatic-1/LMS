const scoreUsersDal = require('cccommon/dal/score_users');
const appErr = require('this_pkg/error');


exports.handler = async (req, res) => {
    let result = null;
    const successStatus = 200;
    const id_lot = Number(req.params.id_lot);
    const valErrs = [];
    const requiredFields = ['id_lot'];

    if(!id_lot){
      appErr.send(req, res, 'validation_error', 'Missing id_lot');
      return;
    }
    
    requiredFields.forEach(field => {
        if (!req.body[field]) {
          valErrs.push({ [field]: 'missing' });
        }
    });
    
    if (valErrs.length) {
      appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
      return;
    }

    try {
        result = await scoreUsersDal.getscoreLotsByIdLots(id_lot);

    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to retrieve score lots');
        return;
    }


      res.status(successStatus).send({
        message: 'Score lots retrieved successfully',
        scoreData: result
    });

};