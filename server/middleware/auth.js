const session = require('express-session');
const connectRedis = require('connect-redis');
const assert = require('assert');
const crypto = require('crypto');
const storage = require('../storage');
const config = require('../config');

const redis_lib =
  config.env === 'development' && config.redis_host === 'mock'
    ? 'redis-mock'
    : 'redis';
const redis = require(redis_lib);

let RedisStore = connectRedis(session);
let redisClient = redis.createClient({
  host: config.redis_host
});

module.exports = {
  hmac: async function(req, res, next) {
    const id = req.params.id;
    const authHeader = req.header('Authorization');
    if (id && authHeader) {
      try {
        const auth = req.header('Authorization').split(' ')[1];
        const meta = await storage.metadata(id);
        if (!meta) {
          return res.sendStatus(404);
        }
        const hmac = crypto.createHmac(
          'sha256',
          Buffer.from(meta.auth, 'base64')
        );
        hmac.update(Buffer.from(meta.nonce, 'base64'));
        const verifyHash = hmac.digest();
        if (crypto.timingSafeEqual(verifyHash, Buffer.from(auth, 'base64'))) {
          req.nonce = crypto.randomBytes(16).toString('base64');
          storage.setField(id, 'nonce', req.nonce);
          res.set('WWW-Authenticate', `send-v1 ${req.nonce}`);
          req.authorized = true;
          req.meta = meta;
        } else {
          res.set('WWW-Authenticate', `send-v1 ${meta.nonce}`);
          req.authorized = false;
        }
      } catch (e) {
        req.authorized = false;
      }
    }
    if (req.authorized) {
      next();
    } else {
      res.sendStatus(401);
    }
  },
  owner: async function(req, res, next) {
    const id = req.params.id;
    const ownerToken = req.body.owner_token;
    if (id && ownerToken) {
      try {
        req.meta = await storage.metadata(id);
        if (!req.meta || req.meta.dead) {
          return res.sendStatus(404);
        }
        const metaOwner = Buffer.from(req.meta.owner, 'utf8');
        const owner = Buffer.from(ownerToken, 'utf8');
        assert(metaOwner.length > 0);
        assert(metaOwner.length === owner.length);
        req.authorized = crypto.timingSafeEqual(metaOwner, owner);
      } catch (e) {
        req.authorized = false;
      }
    }
    if (req.authorized) {
      next();
    } else {
      res.sendStatus(401);
    }
  },
  dlToken: async function(req, res, next) {
    const authHeader = req.header('Authorization');
    if (authHeader && /^Bearer\s/i.test(authHeader)) {
      const token = authHeader.split(' ')[1];
      const id = req.params.id;
      req.meta = await storage.metadata(id);
      if (!req.meta || req.meta.dead) {
        return res.sendStatus(404);
      }
      req.authorized = await req.meta.verifyDownloadToken(token);
    }
    if (req.authorized) {
      next();
    } else {
      res.sendStatus(401);
    }
  },
  instance_owner(req, res, next) {
    if (req.session.role === 'instance_owner') {
      next();
    } else {
      res.sendStatus(401);
    }
  },
  sessionParser: session({
    store: new RedisStore({ client: redisClient }),
    secret: config.session_secret,
    resave: false,
    saveUninitialized: false
  })
};
