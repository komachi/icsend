const crypto = require('crypto');
const config = require('../config');

module.exports = {
  verifyToken(token) {
    if (!config.owner_token_hash) {
      Promise.reject('no token set');
    }

    return new Promise((resolve, reject) => {
      const [salt, key] = config.owner_token_hash.split(':');
      crypto.scrypt(token, salt, 64, (err, derivedKey) => {
        if (err) {
          reject(err);
        } else if (key !== derivedKey.toString('hex')) {
          reject('invalid_token');
        }
        resolve(true);
      });
    });
  },
  async generateTokenHash(token, clientSalt = config.token_auth_client_salt) {
    const tokenDerivedKey = await new Promise((resolve, reject) => {
      crypto.pbkdf2(
        token,
        `${clientSalt}:token`,
        500000,
        64,
        'sha512',
        (err, derivedKey) => {
          if (err) {
            reject(err);
          }
          resolve(derivedKey.toString('base64'));
        }
      );
    });

    const tokenBcryptHash = await new Promise((resolve, reject) => {
      const salt = crypto.randomBytes(16).toString('hex');
      crypto.scrypt(tokenDerivedKey, salt, 64, (err, derivedKey) => {
        if (err) {
          reject(err);
        }
        resolve(`${salt}:${derivedKey.toString('hex')}`);
      });
    });

    return tokenBcryptHash;
  }
};
