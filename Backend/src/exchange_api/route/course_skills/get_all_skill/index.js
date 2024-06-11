const courseSkillDal = require('cccommon/dal/course_skills_table');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
  const id_skill = req.params.id_skill;
  const valErrs = [];

  const onlyDigitsRegex = /^\d+$/;
  
  if (!onlyDigitsRegex.test(id_skill)) {
      valErrs.push({ id_skill: 'should contain only numeric values' });
  }

  if (valErrs.length) {
      appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
      return;
  }

  const numIdSkill = Number(id_skill);

  try {

      const courseSkills = await courseSkillDal.getSkillsBySkillsId(numIdSkill); 
      if (courseSkills.length === 0) {
          appErr.send(req, res, 'course_skill_not_found', 'Course skills not found');
          return;
      }

      res.status(200).json(courseSkills);
  } catch (error) {
      appErr.handleRouteServerErr(req, res, error, 'failed to get course skills by course id');
      return;
  }
};

