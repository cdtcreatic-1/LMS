const skillDal = require('cccommon/dal/skill');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
  const id_skill = Number(req.params.id_skill);
  const valErrs = [];

  if (!id_skill) {
    appErr.send(req, res, 'validation_error', 'Missing id_skill');
    return;
  }

  const onlyDigitsRegex = /^\d+$/;
  if (!onlyDigitsRegex.test(id_skill)) {
      valErrs.push({ id_skill: 'should contain only numeric values' });
  }

  const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  if (specialCharsRegex.test(id_skill)) {
    appErr.send(req, res, 'validation_error', 'id_skill contains special characters');
    return;
  }

  if (valErrs.length) {
    appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
    return;
  }

  try {
    const skill = await skillDal.getSkillById(id_skill); 

    if (!skill) {
      appErr.send(req, res, 'skill_not_found', 'Skill not found');
      return;
    }

    res.status(200).json(skill);
  } catch (error) {
    appErr.handleRouteServerErr(req, res, error, 'failed to get skill by id');
    return;
  }
};
