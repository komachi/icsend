const genmap = require('./generate_asset_map');
const isServer = typeof genmap === 'function';
let manifest = {};
try {
  //eslint-disable-next-line node/no-missing-require
  manifest = require('../dist/manifest.json');
} catch (e) {
  // use middleware
}

const assets = isServer ? manifest : genmap;

function getAsset(name) {
  return assets[name];
}

function getMatches(match) {
  return Object.keys(assets)
    .filter((k) => match.test(k))
    .map(getAsset);
}

const instance = {
  get: getAsset,
  match: getMatches,
  setMiddleware: function (middleware) {
    function getManifest() {
      return JSON.parse(
        middleware.fileSystem.readFileSync(
          middleware.getFilenameFromUrl('/manifest.json')
        )
      );
    }
    if (middleware) {
      instance.get = function getAssetWithMiddleware(name) {
        const m = getManifest();
        return m[name];
      };
      instance.match = function matchAssetWithMiddleware(match) {
        const m = getManifest();
        return Object.keys(m)
          .filter((k) => match.test(k))
          .map((k) => m[k]);
      };
    }
  },
};

module.exports = instance;
