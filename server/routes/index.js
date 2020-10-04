const crypto = require('crypto');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const uaparser = require('ua-parser-js');
const storage = require('../storage');
const config = require('../config');
const auth = require('../middleware/auth');
const language = require('../middleware/language');
const pages = require('./pages');
const clientConstants = require('../clientConstants');

const IS_DEV = config.env === 'development';
const ID_REGEX = '([0-9a-fA-F]{10,16})';

module.exports = function (app) {
  app.set('trust proxy', true);
  app.use(
    helmet({
      contentSecurityPolicy: !IS_DEV,
      hsts: IS_DEV
        ? false
        : {
            maxAge: 31536000,
          },
    })
  );

  app.use(function (req, res, next) {
    req.ua = uaparser(req.header('user-agent'));
    next();
  });
  app.use(function (req, res, next) {
    req.cspNonce = crypto.randomBytes(16).toString('hex');
    next();
  });

  app.use(auth.sessionParser);

  app.use(function (req, res, next) {
    res.set('Pragma', 'no-cache');
    res.set(
      'Cache-Control',
      'private, no-cache, no-store, must-revalidate, max-age=0'
    );
    next();
  });
  app.use(bodyParser.json());
  app.use(bodyParser.text());
  app.get('/', language, pages.index);
  app.get('/config', function (req, res) {
    res.json(clientConstants);
  });
  app.get('/error', language, pages.blank);
  app.get('/report', language, pages.blank);
  app.get('/app.webmanifest', language, require('./webmanifest'));
  app.get(`/download/:id${ID_REGEX}`, language, pages.download);
  app.get('/unsupported/:reason', language, pages.unsupported);
  app.get(`/api/download/token/:id${ID_REGEX}`, auth.hmac, require('./token'));
  app.get(`/api/download/:id${ID_REGEX}`, auth.dlToken, require('./download'));
  app.get(
    `/api/download/blob/:id${ID_REGEX}`,
    auth.dlToken,
    require('./download')
  );
  app.post(
    `/api/download/done/:id${ID_REGEX}`,
    auth.dlToken,
    require('./done.js')
  );
  app.get(`/api/exists/:id${ID_REGEX}`, require('./exists'));
  app.get(`/api/metadata/:id${ID_REGEX}`, auth.hmac, require('./metadata'));
  app.post(`/api/delete/:id${ID_REGEX}`, auth.owner, require('./delete'));
  app.post(`/api/password/:id${ID_REGEX}`, auth.owner, require('./password'));
  app.post(`/api/params/:id${ID_REGEX}`, auth.owner, require('./params'));
  app.post(`/api/info/:id${ID_REGEX}`, auth.owner, require('./info'));
  app.post(`/api/report/:id${ID_REGEX}`, auth.hmac, require('./report'));
  app.post('/api/login', require('./login'));
  app.post('/api/logout', auth.instance_owner, require('./logout'));
  app.get('/__version__', function (req, res) {
    // eslint-disable-next-line node/no-missing-require
    res.sendFile(require.resolve('../../dist/version.json'));
  });

  app.get('/__lbheartbeat__', function (req, res) {
    res.sendStatus(200);
  });

  app.get('/__heartbeat__', async (req, res) => {
    try {
      await storage.ping();
      res.sendStatus(200);
    } catch (e) {
      res.sendStatus(500);
    }
  });
};
