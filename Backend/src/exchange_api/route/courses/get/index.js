const courseDal = require('cccommon/dal/course');
const appErr = require('this_pkg/error');
const {frontend_host, app_url} = require('cccommon/config');

exports.handler = async (req, res) => {
  const id_course = Number(req.params.id_course);
  if (!id_course) {
    appErr.send(req, res, 'validation_error', 'Missing id_course');
    return;
  }
  const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

  if (specialCharsRegex.test(req.params.id_objective)) {
    appErr.send(req, res, 'validation_error', 'id_objective contains special characters');
    return;
  }

  try {
    const courseFound = await courseDal.getCourseById(id_course); 

    if (!courseFound) {
      appErr.send(req, res, 'course_not_found', 'Course not found');
      return;
    }

    if (courseFound?.course_photo) {
      courseFound.course_photo = app_url() + courseFound.course_photo;
    } else {
      courseFound.course_photo = null;
    }
    if (courseFound?.course_curriculum_file) {
      courseFound.course_curriculum_file = app_url() + courseFound.course_curriculum_file;
    } else {
      courseFound.course_curriculum_file = null;
    }

    res.status(200).json(courseFound);
  } catch (error) {
    appErr.handleRouteServerErr(req, res, error, 'failed to get course by id');
    return;
  }
};
