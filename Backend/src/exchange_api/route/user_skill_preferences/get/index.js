const userSkillPreferenceDal = require('cccommon/dal/user_skill_preferences');
const userDal = require('cccommon/dal/user');
const skillDal = require('cccommon/dal/skill');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
  let id_user = req.params.id_user;
  const valErrs = [];

  const onlyDigitsRegex = /^\d+$/;
  const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

  if (!onlyDigitsRegex.test(id_user) || specialCharsRegex.test(id_user)) {
      valErrs.push({ id_user: 'invalid or contains special characters' });
  }

  if (valErrs.length) {
      appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
      return;
  }

  id_user = Number(id_user);

  try {
      const userSkillPreferences = await userSkillPreferenceDal.getUserSkillsByUserId(id_user);
      if (userSkillPreferences.length === 0) {
          appErr.send(req, res, 'user_skill_preference_not_found', 'User skill preferences not found');
          return;
      }

      // Procesamiento para agrupar por curso
      let coursesMap = {};
      for (const preference of userSkillPreferences) {
          const { CourseSkill } = preference;
          if (CourseSkill) {
              const course = coursesMap[CourseSkill.id_course] || { id_course: CourseSkill.id_course, course_skills: [] };

              course.course_skills.push({
                  id_skill: CourseSkill.id_skill,
                  skill_name: CourseSkill.skill_name,
                  id_preference: preference.id_preferences
              });

              coursesMap[CourseSkill.id_course] = course;
          }
      }

      const formattedResponse = {
          id_user: id_user,
          courses: Object.values(coursesMap)
      };

      res.status(200).json(formattedResponse);
  } catch (error) {
      appErr.handleRouteServerErr(req, res, error, 'failed to get user skill preferences by user id');
      return;
  }
};
