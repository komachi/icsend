import { FluentBundle, FluentResource } from '@fluent/bundle';

function makeBundle(locale, ftl) {
  const bundle = new FluentBundle(locale, { useIsolating: false });
  const resource = new FluentResource(ftl);
  bundle.addResource(resource);
  return bundle;
}

export async function getTranslator(locale) {
  const bundles = [];
  const { default: en } = await import('../public/locales/en-US/send.ftl');
  if (locale !== 'en-US') {
    const { default: ftl } = await import(
      `../public/locales/${locale}/send.ftl`
    );
    bundles.push(makeBundle(locale, ftl));
  }
  bundles.push(makeBundle('en-US', en));
  return function (id, data = {}) {
    for (let bundle of bundles) {
      const message = bundle.getMessage(id);
      if (message.value) {
        return bundle.formatPattern(message.value, data, []);
      }
    }
  };
}
