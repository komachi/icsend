const config = require('./config');
const layout = require('./layout');
const getTranslator = require('./locale');

module.exports = async function(req) {
  const locale = req.language || 'en-US';
  let authConfig = null;
  let robots = 'none';
  if (req.route && req.route.path === '/') {
    robots = 'all';
  }
  const prefs = {};
  return {
    archive: {
      numFiles: 0
    },
    locale,
    capabilities: { account: false },
    translate: getTranslator(locale),
    title: 'Justsend',
    description:
      'Encrypt and send files with a link that automatically expires to ensure your important documents don’t stay online forever.',
    baseUrl: config.base_url,
    ui: {},
    storage: {
      files: []
    },
    fileInfo: {},
    cspNonce: req.cspNonce,
    robots,
    authConfig,
    prefs,
    layout,
    user: { loggedIn: false }
  };
};
