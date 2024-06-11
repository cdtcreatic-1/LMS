const courseDal = require('cccommon/dal/course');
const courseProfileDal = require('cccommon/dal/courseProfile');
const courseStatusDal = require('cccommon/dal/courseStatus');
const appErr = require('this_pkg/error');
const path = require('path');
const { frontend_host, app_url } = require('cccommon/config');


exports.handler = async (req, res) => {
    let course;

    const successStatus = 201;

    const {
        course_title,
        course_description,
        course_duration,
        course_instructor_name,
        course_video,
        course_price,
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

    const allowedFormats = ['image/jpeg', 'image/png']; // Formatos permitidos
    const maxFileSize = 3 * 1024 * 1024; // Tamaño máximo permitido (3MB en bytes)
    
    let course_photo = null;

    if (req.files && req.files.course_photo) {
        const uploadedFile = req.files.course_photo[0];
        // Validar el formato del archivo
        if (!allowedFormats.includes(uploadedFile.mimetype)) {
            return res.status(400).json({ error: 'Formato de archivo no permitido.' });
        }
        // Validar el tamaño del archivo
        if (uploadedFile.size > maxFileSize) {
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

    // // Validation for character limits
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
    //     course_video: 10,
    //     course_start_date: 10,
    // };

    // for (const field in maxLengths) {
    //     if (req.body[field] && req.body[field].length > maxLengths[field]) {
    //         valErrs.push({ [field]: `should not exceed ${maxLengths[field]} characters` });
    //     }
    // }

    // for (const field in minLengths) {
    //     if (req.body[field] && req.body[field].length < minLengths[field]) {
    //         valErrs.push({ [field]: `should have at least ${minLengths[field]} characters` });
    //     }
    // }

    // Price: only numbers and up to two decimals
    // const priceRegex = /^\d+(\.\d{1,2})?$/;
    // if (!priceRegex.test(course_price)) {
    //     appErr.send(req, res, 'invalid_input', 'Invalid price');
    //     return;
    // }

    // Date: in the format "YYYY-MM-DD"
    // const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const dateRegex = /^(?:\d{4})-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])$/;
    if (!dateRegex.test(course_start_date)) {
        appErr.send(req, res, 'invalid_input', 'Invalid date format. Expected format: YYYY-MM-DD');
        return;
    }

    const specialCharsRegexDescription = /^[0-9a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s,.\-_\/;:]{20,200}$/;
    if (!specialCharsRegexDescription.test(course_title)) {
        valErrs.push({ course_title: 'contains some special characters not allowed mas de 20 letras' });
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

    // const specialCharsRegexName = /^[\p{L}\sáéíóúüñÑÁÉÍÓÚÜA-Za-z]+$/u       ///[!@#$%^&()_\=\[\]{}'"\\|<>\/]+/;
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
    // const specialCharsDateRegex = /[!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?]+/;
    // const fieldsToCheckForSpecialCharsDate = [
    //     'course_start_date'
    // ];

    // fieldsToCheckForSpecialChars.forEach(field => {
    //     if (req.body[field] && specialCharsRegex.test(req.body[field])) {
    //         valErrs.push({ [field]: 'contains special characters' });
    //     }
    // });
    // fieldsToCheckForSpecialCharsDate.forEach(field => {
    //     if (req.body[field] && specialCharsDateRegex.test(req.body[field])) {
    //         valErrs.push({ [field]: 'contains special characters' });
    //     }
    // });

    // const leadingSpaceRegex = /^\s+/;
    // requiredFields.forEach(field => {
    //     if (req.body[field] && leadingSpaceRegex.test(req.body[field])) {
    //         valErrs.push({ [field]: 'starts with excessive whitespace' });
    //     }
    // });

    // const allowedImageTypes = ['.jpg', '.jpeg', '.png'];
    // const imageExtension = path.extname(course_photo).toLowerCase();
    // if (course_photo && !allowedImageTypes.includes(imageExtension)) {
    //     valErrs.push({ course_photo: 'Invalid image type' });
    // }
    // const maxImageSize = 1 * 1024 * 1024;
    // if (req.files && req.files.course_photo && req.files.course_photo[0].size > maxImageSize) {
    //     valErrs.push({ course_photo: 'image size should not exceed 1 MB' });
    // }

    // const onlyDigitsRegex = /^\d+$/;
    // const allowedPresentationTypes = ['.pdf', '.doc', '.docx'];
    // const presentationExtension = path.extname(course_curriculum_file).toLowerCase();
    // if (!allowedPresentationTypes.includes(presentationExtension)) {
    //     valErrs.push({ course_curriculum_file: 'Invalid file type' });
    // }

    // const maxPresentationSize = 3 * 1024 * 1024;
    // if (req.files && req.files.course_curriculum_file && req.files.course_curriculum_file[0].size > maxPresentationSize) {
    //     valErrs.push({ course_curriculum_file: 'Presentation size should not exceed 3 MB' });
    // }

    if (valErrs.length) {
        appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
        return;
    }

    try {
        console.log("Entra")
        const courseExists = await courseDal.getCourseByTitle(course_title);
        console.log("Entra 2")

        if (courseExists) {
            appErr.send(req, res, 'course_exist', 'Course already exists');
            return;
        }

        course = await courseDal.createCourse({
            course_title,
            course_description,
            course_duration,
            course_instructor_name,
            course_price,
            course_video,
            course_curriculum_file,
            course_start_date,
            course_photo,
            course_status,
        });

    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to create course');
        return;
    }

    res.status(successStatus).send({
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
