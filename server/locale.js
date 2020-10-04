const fs = require('fs');
const path = require('path');
const { FluentBundle, FluentResource } = require('@fluent/bundle');
const localesPath = path.resolve(__dirname, '../public/locales');
const locales = fs.readdirSync(localesPath);

function makeBundle(locale) {
  const bundle = new FluentBundle(locale, { useIsolating: false });
  const resource = new FluentResource(
    fs.readFileSync(path.resolve(localesPath, locale, 'send.ftl'), 'utf8')
  );
  bundle.addResource(resource);
  return [locale, bundle];
}

const bundles = new Map(locales.map(makeBundle));

module.exports = function getTranslator(locale) {
  const defaultBundle = bundles.get('en-US');
  const bundle = bundles.get(locale) || defaultBundle;
  return function (id, data = {}) {
    const message = bundle.getMessage(id);
    if (message.value) {
      return bundle.formatPattern(message.value, data, []);
    }
    const defaultMessage = defaultBundle.getMessage(id);
    if (defaultMessage.value) {
      return defaultBundle.formatPattern(defaultMessage.value, data, []);
    }
  };
};
