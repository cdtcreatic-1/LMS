const scoreLotsDal = require('cccommon/dal/score_lots');
const appErr = require('this_pkg/error');


exports.handler = async (req, res) => {
  let result = null;
  const successStatus = 200;
  try {
    result = await scoreLotsDal.getAllScoreLots();

  } catch (err) {
    appErr.handleRouteServerErr(req, res, err, 'failed to retrieve score lots');
    return;
  }
  // Calculate average score for each lot
  for (const id_lot in result) {
    const scores = result[id_lot].score;
    const scoreSum = scores.reduce((a, b) => a + b, 0);
    const average = scoreSum / scores.length;
    result[id_lot].average = average;
  }

  res.status(successStatus).send({
    message: 'Score lots retrieved successfully',
    score: result
  });

};