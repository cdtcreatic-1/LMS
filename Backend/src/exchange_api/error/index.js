
exports.send = (req, res, appCode, ...tableArgs) => {
  console.log("appCode: ", appCode)
  let errSpec = table[appCode];
  if (errSpec === undefined) {
    console.log(`route handler tried to use and invalid app error code: [${appCode}]`);
    errSpect = table.server_error.errConstructor(500);
    errSpec.code = errSpec.appCode;

    res.status(errSpec.status).send(exports.addRequestIdToObj(req, errSpec));
  } else {
    let errObj = errSpec.errConstructor(...tableArgs);
    errObj.code = appCode;

    errObj = exports.addRequestIdToObj(req, errObj);
    console.log("exchange_api error response: ", errObj);

    res.status(errObj.status).send(errObj);
  }
};

exports.addRequestIdToObj = (req, obj) => {
  obj.id = req.id;
  return obj;
};

exports.mergeValErrLists = (valErrs) => {
  let out = {};
  for (let v of valErrs) {
    out = Object.assign({}, out, v);
  }
  return out;
};

exports.newError = newError;

exports.handleRouteServerErr = (req, res, err, msg) => {
  if (err) {
    err = {
      code: err.code,
      message: err.message,
      stack: err.stack
    };
  }
  console.log(err)
  exports.send(req, res, 'server_error', err.code, msg, err.message);
};

function newError(status, message, details) {
  return { status: status, message: message, details: details };
}

const table = {};

function addToTable(appErrCode, errConstructor) {
  if (table[appErrCode]) {
    throw new Error(`Application error code [${appErrCode}] already exists`);
  }

  table[appErrCode] = {
    appCode: appErrCode,
    errConstructor: errConstructor
  };
}

addToTable('bad_request', (messaje, details) => {
  return newError(400, messaje, details);
});

addToTable('validation_error', (details) => {
  return newError(400, 'One or more input fields was not accepted.', details);
});

addToTable('validation_buy_lot_error', (details) => {
  return newError(409, 'The buyer (Businessman) should not be the same person as the one who sells the lot (farmer).', details);
});

addToTable('validation_buy_course_error', (details) => {
  return newError(409, 'The buyer (Apprentice) should not be the same person as the one who sells the course.', details);
});

addToTable('user_exist_document', (details) => {
  return newError(400, 'A user with this document number already exists', details);
});

addToTable('businesman_coffee_interested_exist', (details) => {
  return newError(400, 'Businesman coffee interested already exists', details);
});

addToTable('unauthorized', () => {
  return newError(401, 'Unauthorized');
});

addToTable('unauthorized user', () => {
  return newError(401, 'User account not enabled. Please verify your email.');
});

addToTable('unauthorized role', () => {
  return newError(401, 'Unauthorized Role');
});

addToTable('forbidden', (message, details) => {
  return newError(403, message, details);
});

addToTable('course_not_found', () => {
  return newError(404, 'Not Found');
});

addToTable('farm_not_found', () => {
  return newError(404, 'Not Found');
});

addToTable('learning_not_found', () => {
  return newError(404, 'Not Found');
});

addToTable('course_profile_not_found', () => {
  return newError(404, 'Not Found');
});

addToTable('course_status_not_found', () => {
  return newError(404, 'Not Found');
});

addToTable('missing_id', () => {
  return newError(400, 'Bad Request');
});

addToTable('objective_not_found', () => {
  return newError(404, 'Not Found');
});

addToTable('news_event_not_found', () => {
  return newError(404, 'Not Found');
});

addToTable('skill_not_found', () => {
  return newError(404, 'Not Found');
});

addToTable('course_skill_not_found', () => {
  return newError(404, 'Not Found');
});

addToTable('user_skill_preference_not_found', () => {
  return newError(404, 'Not Found');
});

addToTable('not_found', () => {
  return newError(404, 'Not Found');
});

addToTable('documentation_not_found', () => {
  return newError(404, 'Not Found');
});

addToTable('user_not_exist', () => {
  return newError(400, 'User not exist');
});

addToTable('module_objective_not_found', () => {
  return newError(404, 'Not Found');
});

addToTable('module_not_found', () => {
  return newError(404, 'Not Found');
});

addToTable('evaluation_not_found', () => {
  return newError(404, 'Not Found');
});

addToTable('answer_not_found', () => {
  return newError(404, 'Not Found');
});

addToTable('question_not_found', () => {
  return newError(404, 'Not Found');
});

addToTable('submodule_not_found', () => {
  return newError(404, 'Not Found');
});

addToTable('passwords_not_match', () => {
  return newError(400, 'Passwords do not match');
});

addToTable('business_rule_violation', () => {
  return newError(400, 'business_rule_violation');
});

addToTable('status_conflict', (message, details) => {
  return newError(409, message, details);
});

addToTable('server_error', (status, message, details) => {
  if (status === undefined) {
    status = 500;
  }
  if (message === undefined) {
    message = 'The server failed to process the request. Please include the requestId when reporting the issue.';
  }
  return newError(status, message, details);
});

addToTable('input_validation_failed', (details) => {
  return newError(400, 'One or more input fields was not accepted.', details);
});

addToTable('all_fields_missing', (details) => {
  return newError(400, 'all fileds are missing.', details);
});

addToTable('status_transition_forbidden', (message, details) => {
  return newError(403, message, details);
});

addToTable('status_transition_invalid', (message, details) => {
  return newError(409, message, details);
});

addToTable('security_validation_failed', (details) => {
  return newError(400, 'One or more of the devices did pass the security validation', details);
});

addToTable('invalid token', (message, details) => {
  return newError(409, message, details);
});

addToTable('other', (message, details) => {
  return newError(410, message, details);
});

addToTable('user_exist', (message, details) => {
  return newError(409, message, details);
});

addToTable('user_skill_preference_exist', (message, details) => {
  return newError(409, message, details);
});

addToTable('lot_certification_exist', (message, details) => {
  return newError(409, message, details);
});

addToTable('course_skill_preference_exist', (message, details) => {
  return newError(409, message, details);
});

addToTable('question_exist', (message, details) => {
  return newError(409, message, details);
});

addToTable('submodule_exist', (message, details) => {
  return newError(409, message, details);
});

addToTable('evaluation_exist', (message, details) => {
  return newError(409, message, details);
});

addToTable('module_exist', (message, details) => {
  return newError(409, message, details);
});

addToTable('answer_exist', (message, details) => {
  return newError(409, message, details);
});

addToTable('course_exist', (message, details) => {
  return newError(409, message, details);
});

addToTable('user_not_found', (message, details) => {
  return newError(404, message, details);
});

addToTable('user_role_already_exists', (message, details) => {
  return newError(409, message, details);
});

addToTable('current_window_exist', (message, details) => {
  return newError(409, message, details);
});

addToTable('user_conflict', (message, details) => {
  return newError(409, message, details);
});

addToTable('business_data_exist', (message, details) => {
  return newError(409, message, details);
});

addToTable('farm_exist', (message, details) => {
  return newError(409, message, details);
});

addToTable('cart_exist', (message, details) => {
  return newError(409, message, details);
});

addToTable('lot_does_not_exist', (message, details) => {
  return newError(409, message, details);
});

addToTable('passwords_do_not_match',(message, details) => {
  return newError(409, message, details);
});

addToTable('farm_documentation_exist', (message, details) => {
  return newError(409, message, details);
});

addToTable('Farm_or_farmer_not_found', (message, details) => {
  return newError(409, message, details);
});

addToTable('user_not_admin', (message, details) => {
  return newError(409, message, details);
});

addToTable('invalid_input', (message, details) => {
  return newError(409, message, details);
});
