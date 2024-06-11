const skillDal = require('cccommon/dal/skill');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
  try {
    const skill = await skillDal.getAllSkill(); 

    if (!skill) {
      appErr.send(req, res, 'skill_not_found', 'Skills not found');
      return;
    }

    res.status(200).json(skill);
  } catch (error) {
    appErr.handleRouteServerErr(req, res, error, 'failed to get skills');
    return;
  }
};
