const courseSkillDal = require('cccommon/dal/course_skills_table');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
  const id_course = req.params.id_course;
  const valErrs = [];

  const onlyDigitsRegex = /^\d+$/;
  
  if (!onlyDigitsRegex.test(id_course)) {
      valErrs.push({ id_course: 'should contain only numeric values' });
  }

  if (valErrs.length) {
      appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
      return;
  }

  const numIdCourse = Number(id_course);

  try {

      const courseSkills = await courseSkillDal.getSkillsBySkillsId(numIdCourse); 
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

