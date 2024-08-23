const FarmDocumentationDal = require('cccommon/dal/farm_documentation');
const appErr = require('this_pkg/error');
const { frontend_host, app_url } = require('cccommon/config');
const path = require('path');

// const validateFile = (file) => {
//   const errors = [];
//   if (file) {
//     const maxFileSize = 3 * 1024 * 1024;
//     const allowedFileTypes = ['.pdf'];

//     if (file.size > maxFileSize) {
//       errors.push('File size exceeds limit');
//     }
//     const fileExtension = path.extname(file.originalname).toLowerCase();
//     if (!allowedFileTypes.includes(fileExtension)) {
//       errors.push('Invalid file type');
//     }
//   } else {
//     errors.push('File missing');
//   }
//   return errors;
// };

exports.handler = async (req, res) => {
  const successStatus = 201;
  const id_user = Number(req.body.id_user);

  const farm_documentation_id_document = req.files?.farm_documentation_id_document?.[0];
  const farm_documentation_rut = req.files?.farm_documentation_rut?.[0];
  const farm_documentation_chamber_commerce = req.files?.farm_documentation_chamber_commerce?.[0];

  const validationErrors = [];

  if (!Number.isInteger(id_user) || id_user <= 0) {
    validationErrors.push({ id_user: 'Invalid id_user' });
  }
  const maxPdfSiz = 3 * 1024 * 1024; // 3 MB
if (req.files && req.files.farm_documentation_chamber_commerce) {
  req.files.farm_documentation_chamber_commerce.forEach((file, index) => {
      if (file.mimetype !== 'application/pdf') {
          validationErrors.push({ farm_documentation_chamber_commerce: `Only PDF files are allowed for PDF ${index + 1}` });
      } else if (file.size > maxPdfSiz) {
          validationErrors.push({ farm_documentation_chamber_commerce: `PDF ${index + 1} size should not exceed 3 MB` });
      }
  });
}
const maxPdfSize = 3 * 1024 * 1024; // 3 MB

if (req.files && req.files.farm_documentation_rut) {
  req.files.farm_documentation_rut.forEach((file, index) => {
      if (file.mimetype !== 'application/pdf') {
          validationErrors.push({ farm_documentation_rut: `Only PDF files are allowed for PDF ${index + 1}` });
      } else if (file.size > maxPdfSize) {
          validationErrors.push({ farm_documentation_rut: `PDF ${index + 1} size should not exceed 3 MB` });
      }
  });
}

const maxPdfSizeid = 3 * 1024 * 1024; // 3 MB

if (req.files && req.files.farm_documentation_id_document) {
  req.files.farm_documentation_id_document.forEach((file, index) => {
      if (file.mimetype !== 'application/pdf') {
          validationErrors.push({ farm_documentation_id_document: `Only PDF files are allowed for PDF ${index + 1}` });
      } else if (file.size > maxPdfSizeid) {
          validationErrors.push({ farm_documentation_id_document: `PDF ${index + 1} size should not exceed 3 MB` });
      }
  });
}

  // validationErrors.push(...validateFile(farm_documentation_id_document));
  // validationErrors.push(...validateFile(farm_documentation_rut));
  // validationErrors.push(...validateFile(farm_documentation_chamber_commerce));

  if (validationErrors.length) {
    appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(validationErrors));
    return;
  }

  try {
    const FarmDocumentationExists = await FarmDocumentationDal.getFarmDocumentationByUserId(id_user);
    if (FarmDocumentationExists) {
      appErr.send(req, res, 'farm_documentation_exist', 'Farm documentation for user already exists');
      return;
    }

    const FarmDocumentation = await FarmDocumentationDal.createFarmDocumentation({
      id_user,
      farm_documentation_id_document: app_url() + farm_documentation_id_document.path,
      farm_documentation_rut: app_url() + farm_documentation_rut.path,
      farm_documentation_chamber_commerce: app_url() + farm_documentation_chamber_commerce.path
    });

    res.status(successStatus).send({
      message: 'Farm documentation for user created successfully',
      FarmDocumentation
    });

  } catch (err) {
    appErr.handleRouteServerErr(req, res, err, 'Failed to create farm documentation for user');
  }
};
