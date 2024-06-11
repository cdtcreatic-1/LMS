const { verifyToken }  = require('cccommon/user');
const appErr = require('this_pkg/error');
const userDal = require('cccommon/dal/user');

exports.handler = async (req, res) => {
    const token = req.params.token;

    if (!token) {
        appErr.send(req, res, 'unauthorized');
        return;
    }

    try {
        const decoded = verifyToken(token);
        if (decoded && decoded.id_user) {
            await userDal.enableUser(decoded.id_user);
            const userResult = await userDal.getUserByIdUser(decoded.id_user)
            return res.status(200).json({ 
                valid: true, 
                id_user: decoded.id_user,
                token: token,
                id_role: userResult.id_role
            });
        } else {
            return res.status(401).json({ valid: false, error: 'Invalid token' });
        }
    } catch (err) {
        return res.status(401).json({ valid: false, error: 'Invalid token' });
    }
};
