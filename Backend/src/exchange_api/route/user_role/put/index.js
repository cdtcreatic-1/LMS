
const userRoleDal = require('cccommon/dal/user_role');
const userDal = require('cccommon/dal/user');
const appErr = require('this_pkg/error')

exports.handler = async (req, res) => {

    const { id_user, id_role } = req.body;

    const valErrs = [];

    const requiredFields = ['id_user', 'id_role'];

    requiredFields.forEach((field) => {
        if (!req.body[field]) {
            valErrs.push({ [field]: 'missing' });
        }
    });

    if(valErrs.length) {
        appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
        return;
    }

    try {

        const userExists = await userDal.getUserByIdUser(id_user);

        if(!userExists) {
            appErr.send(req, res, 'user_not_found');
            return;
        }


        let userRoleExists = await userRoleDal.getIdRoleByIdUser(id_user);

        userRoleExists = userRoleExists.toJSON();

        if(!userRoleExists.length) {
            appErr.send(req, res, 'user_role_not_found');
            return;
        }

        const userRole = await userRoleDal.updateUserRole(id_user, id_role);

    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed_to_add_user_role');
    }

    res.status(200).send({
        message: 'User role added successfully'
    });
};