const userDal = require('cccommon/dal/user');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
    const page = req.query.page
    const successStatus = 200;
    const valErrs = [];
    let users;

    if (!page) {
        valErrs.push({ user_email: 'missing' });
    }

    if (valErrs.length) {
        appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
        return;
    }

    try {

        users = await userDal.getUsersPaginated(page);

        if (!users) {
            appErr.send(req, res, 'not_found', 'User not found');
            return;
        }

    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to get user by email');
        return;
    }

    // Send just enough for debugging & logged-in status/identity in UIs.

    res.status(successStatus).send({
        users: users
    });


};






