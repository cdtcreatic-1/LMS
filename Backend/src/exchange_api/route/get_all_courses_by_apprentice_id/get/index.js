const courseDal = require('cccommon/dal/course');
const appErr = require('this_pkg/error');
const { frontend_host, app_url } = require('cccommon/config');

exports.handler = async (req, res) => {
    const id_user = req.params;
    try {
        const courses = await courseDal.getAllCoursesbyUser(id_user);

        if (!courses || courses.length === 0) {
            appErr.send(req, res, 'courses_not_found', 'No courses found');
            return;
        }

        const coursesWithPhotos = courses.map(course => {
            if (course.course_photo) {
                return {
                    ...course.dataValues,
                    course_curriculum_file: app_url() + course.course_curriculum_file,
                    course_photo: app_url() + course.course_photo
                };
            } else {
                return {
                    ...course.dataValues,
                    course_photo: null
                };
            }
        });

        res.status(200).json(coursesWithPhotos);
    } catch (error) {
        appErr.handleRouteServerErr(req, res, error, 'failed to get courses');
        return;
    }
};