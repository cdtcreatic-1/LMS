const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const SALT_LENGTH = 10; // Longitud de la sal en bytes
const ITERATIONS = process.env.PASSWORD_ITERATIONS || 100000;
const HASH_LENGTH = 64;
const HASH_ALGORITHM = process.env.PASSWORD_HASH_ALGORITHM || 'sha256';

const SECRET_KEY = 'creatic_trade_secret_key';


exports.genPasswordSync = (raw) => {
    const salt = crypto.randomBytes(SALT_LENGTH).toString('hex');
    const hash = crypto.pbkdf2Sync(raw, salt, ITERATIONS, HASH_LENGTH, HASH_ALGORITHM).toString('base64');
    return `${salt}:${hash}`;
};

exports.verifyPasswordSync = (raw, saved) => {
    const [salt, hash] = saved.split(':');
    const newHash = crypto.pbkdf2Sync(raw, salt, ITERATIONS, HASH_LENGTH, HASH_ALGORITHM).toString('base64');
    return hash === newHash;
};


exports.genTokenSync = (id_user) => {
    const payload = {
        id_user: id_user,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 4) // 4 hours 
    };

    return jwt.sign(payload, SECRET_KEY);
};
  
exports.verifyToken = (token) => {
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      return decoded;
    } catch (err) {
      console.error('Error al verificar el token:', err);
      return null;
    }
  };
  