const courseDal = require('cccommon/dal/course');
const appErr = require('this_pkg/error');
const { frontend_host, app_url } = require('cccommon/config');
const moment = require('moment');

exports.handler = async (req, res) => {
    const successStatus = 200;

    const {
        id_course,
        course_title,
        course_description,
        course_duration,
        course_instructor_name,
        course_price,
        course_video,
        course_start_date,
        course_status,
    } = req.body;

    // let course_photo = null;
    // if (req.files && req.files.course_photo) {
    //     course_photo = req.files.course_photo[0].path;
    // }
    let course_curriculum_file = null;
    if (req.files) {
        if (req.files.course_curriculum_file) {
            course_curriculum_file = req.files.course_curriculum_file[0].path;
        }
    }

    const valErrs = [];

    const allowedFormat = ['image/jpg', 'image/png']; // Formatos permitidos
    const maxFileSiz = 3 * 1024 * 1024; // Tamaño máximo permitido (3MB en bytes)

    let course_photo = null;
    if (req.files && req.files.course_photo) {
        const uploadedFile = req.files.course_photo[0];
        // Validar el formato del archivo
        if (!allowedFormat.includes(uploadedFile.mimetype)) {
            return res.status(400).json({ error: 'Formato de archivo no permitido.' });
        }
        // Validar el tamaño del archivo
        if (uploadedFile.size > maxFileSiz) {
            return res.status(400).json({ error: 'El tamaño del archivo excede el límite permitido.' });
        }
        course_photo = uploadedFile.path;
    }
    const maxPdfSiz = 3 * 1024 * 1024; // 3 MB
    if (req.files && req.files.course_curriculum_file) {
      req.files.course_curriculum_file.forEach((file, index) => {
          if (file.mimetype !== 'application/pdf') {
              valErrs.push({ course_curriculum_file: `Only PDF files are allowed for PDF ${index + 1}` });
          } else if (file.size > maxPdfSiz) {
              valErrs.push({ course_curriculum_file: `PDF ${index + 1} size should not exceed 3 MB` });
          }
      });
    }

    let updateData = {};

    if (course_title) updateData.course_title = course_title;
    if (course_description) updateData.course_description = course_description;
    if (course_duration) updateData.course_duration = course_duration;
    if (course_instructor_name) updateData.course_instructor_name = course_instructor_name;
    if (course_video) updateData.course_video = course_video;
    if (course_price) updateData.course_price = course_price;
    if (course_curriculum_file) updateData.course_curriculum_file = course_curriculum_file;
    if (course_photo) updateData.course_photo = course_photo;
    if (course_start_date) updateData.course_start_date = new Date(course_start_date);
    if (course_status) updateData.course_status = course_status;
    updateData.course_updated_at = new Date();

    if (!id_course) {
        appErr.send(req, res, 'missing_id', 'Course ID missing');
        return;
    }
    let requiredFields = [
        'course_title',
        'course_price',
        'course_video',
        'course_start_date',
        'course_status',
    ];

    requiredFields.forEach(field => {
        if (!req.body[field]) {
            valErrs.push({ [field]: 'missing' });
        }
    });

    // const maxLengths = {
    //     course_title: 100,
    //     course_description: 1500,
    //     course_duration: 250,
    //     course_instructor_name: 50,
    //     course_price: 10,
    //     course_video: 300,
    //     course_start_date: 10,
    // };
    // const minLengths = {
    //     course_title: 10,
    //     course_description: 20,
    //     course_duration: 3,
    //     course_instructor_name: 5,
    //     course_price: 5,
    //     course_video: 5,
    //     course_start_date: 10,
    // };

    // for (const field in maxLengths) {
    //     if (req.body[field] && req.body[field].length > maxLengths[field]) {
    //         valErrs.push(`${field} no debe pasar de ${maxLengths[field]} caracteres`);
    //     }
    // }

    // for (const field in minLengths) {
    //     if (req.body[field] && req.body[field].length < minLengths[field]) {
    //         valErrs.push(`${field} debe tener al menos ${minLengths[field]} caracteres`);
    //     }
    // }

    const dateRegex = /^(?:\d{4})-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])$/;
    if (!dateRegex.test(course_start_date)) {
        appErr.send(req, res, 'invalid_input', 'Invalid date format. Expected format: YYYY-MM-DD');
        return;
    }

    const specialCharsRegexDescription = /^[0-9a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s,.\-_\/;:]{20,200}$/;
    if (!specialCharsRegexDescription.test(course_title)) {
        valErrs.push({ course_title: 'contains some special characters not allowed' });
    }


    const RegexDescription = /^[A-Za-z0-9áéíóúÁÉÍÓÚüÜñÑ.,\/\-_:;"'¿?!¡\s]{20,1500}$/;
    if (!RegexDescription.test(course_description)) {
        valErrs.push({ course_description: 'contains some special characters not allowed' });
    }

    const RegexCourseDuration = /^[A-Za-z0-9áéíóúüÜñÑ\s]{3,20}$/;
    if (!RegexCourseDuration.test(course_duration)) {
        valErrs.push({ course_duration: 'contains special characters' });
    }

    const RegexCourseinstructor = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]{6,50}$/;
    if (!RegexCourseinstructor.test(course_instructor_name)) {
        valErrs.push({ course_instructor_name: 'contains special characters' });
    }

    const priceRegex = /^\d{4,10}$/;
    if (!priceRegex.test(course_price)) {
        valErrs.push({ course_price: 'contains special characters' });
    }


    

    // // Price: only numbers and up to two decimals
    // const priceRegex = /^\d+(\.\d{1,2})?$/;
    // if (!priceRegex.test(updateData.course_price)) {
    //     appErr.send(req, res, 'invalid_input', 'Invalid price');
    //     return;
    // }

    // // Date: in the format "YYYY-MM-DD"
    // const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    // const formatedDate = moment(updateData.course_start_date).format('YYYY-MM-DD');
    // if (!dateRegex.test(formatedDate)) {
    //     appErr.send(req, res, 'invalid_input', 'Invalid date format. Expected format: YYYY-MM-DD');
    //     return;
    // }
    // const specialCharsRegexDescription = /[^(?!.*(\d)\1{5,})[a-zA-Z0-9áéíóúÁÉÍÓÚüÜ.%!¡¿?ñÑ,\s]*$]+/    ///[!@#$%^&()_\=\[\]{}'"\\|<>\/]+/;
    // const fieldsToCheckForSpecialCharsDescription = [
    //     'course_title',
    //     'course_description',
    // ];
    // fieldsToCheckForSpecialCharsDescription.forEach(field => {
    //     if (req.body[field] && specialCharsRegexDescription.test(req.body[field])) {
    //         valErrs.push({ [field]: 'contains some special characters not allowed' });
    //     }
    // });

    // const specialCharsRegexName = /[\w\sáéíóúÁÉÍÓÚ,\.ñÑ]+/    ///[!@#$%^&()_\=\[\]{}'"\\|<>\/]+/;
    // const fieldsToCheckForSpecialCharsName = [
    //     'course_instructor_name'
    // ];
    // fieldsToCheckForSpecialCharsName.forEach(field => {
    //     if (req.body[field] && !specialCharsRegexName.test(req.body[field])) {
    //         valErrs.push({ [field]: 'contains some special characters not allowed' });
    //     }
    // });

    // const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    // const fieldsToCheckForSpecialChars = [
    //     'course_duration',
    //     'course_price',
    //     'course_status',
    // ];

    // fieldsToCheckForSpecialChars.forEach(field => {
    //     if (req.body[field] && specialCharsRegex.test(req.body[field])) {
    //         valErrs.push({ [field]: 'contains special characters' });
    //     }
    // });

    // const leadingSpaceRegex = /^\s+/;
    // requiredFields.forEach(field => {
    //     if (req.body[field] && leadingSpaceRegex.test(req.body[field])) {
    //         valErrs.push({ [field]: 'starts with excessive whitespace' });
    //     }
    // });

    // const maxImageSize = 1 * 1024 * 1024;
    // if (req.files && req.files.course_photo && req.files.course_photo[0].size > maxImageSize) {
    //     valErrs.push({ course_photo: 'image size should not exceed 1 MB' });
    // }

    const onlyDigitsRegex = /^\d+$/;
    if (!onlyDigitsRegex.test(id_course)) {
        valErrs.push({ id_course: 'should contain only numeric values' });
    }

    if (valErrs.length) {
        appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
        return;
    }
    let course;
    try {
        const courseExists = await courseDal.getCourseById(id_course);
        if (!courseExists) {
            appErr.send(req, res, 'course_not_found', 'Course not found');
            return;
        }
        course = await courseDal.updateCourse(id_course, updateData);

    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to update course');
        return;
    }

    res.status(successStatus).send({
        message: "Curso con nombre: " + course.course_title + " actualizado con éxito",
        course_title: course.course_title,
        course_description: course.course_description,
        course_duration: course.course_duration,
        course_instructor_name: course.course_instructor_name,
        course_video: course.course_video,
        course_price: course.course_price,
        course_curriculum_file: app_url() + course.course_curriculum_file,
        course_start_date: course.course_start_date,
        course_photo: app_url() + course.course_photo,
        course_status: course.course_status,
        id_course: course.id_course,
    });
};
