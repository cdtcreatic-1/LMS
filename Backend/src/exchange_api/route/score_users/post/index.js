const scoreLotsDal = require('cccommon/dal/score_lots');
const appErr = require('this_pkg/error');


exports.handler = async (req, res) => {
    let result = null;
    const successStatus = 200;
    const { id_lot, id_user, score } = req.body;

    const valErrs = [];
    const requiredFields = ['id_lot', 'id_user', 'score'];

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
        result = await scoreLotsDal.saveScoreLots({id_lot, id_user, score});

      } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to create score lots');
        return;
    }


      res.status(successStatus).send({
        message: 'Score lots created successfully',
        scoreData: result
    });

};