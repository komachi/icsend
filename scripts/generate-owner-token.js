const crypto = require('crypto');
const { generateTokenHash } = require('../server/auth/token');

const args = process.argv.slice(2);
const token = args[0] || crypto.randomBytes(64).toString('base64');
const clientSalt =
  process.env.TOKEN_AUTH_CLIENT_SALT ||
  crypto.randomBytes(64).toString('base64');

generateTokenHash(token, clientSalt).then(result => {
  console.log(`OWNER_TOKEN_HASH=${result}`);
  console.log(`TOKEN_AUTH_CLIENT_SALT=${clientSalt}`);
});
