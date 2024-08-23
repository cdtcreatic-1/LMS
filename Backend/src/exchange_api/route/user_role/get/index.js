
const userRoleDal = require('cccommon/dal/user_role');
const userDal = require('cccommon/dal/user');
const appErr = require('this_pkg/error')

exports.handler = async (req, res) => {

    const { id_user } = req.params;

    try {

        const userExists = await userDal.getUserByIdUser(id_user);

        if(!userExists) {
            appErr.send(req, res, 'user_not_found');
            return;
        }

        let userRoleExists = await userRoleDal.getIdRoleByIdUser(id_user);


        if(!userRoleExists.length) {
            appErr.send(req, res, 'user_role_not_found');
            return;
        }

        res.status(200).send({
            message: 'User role found successfully',
            userRoleExists
        });

    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed_to_add_user_role');
    }
};