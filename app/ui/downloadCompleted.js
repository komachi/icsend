const html = require('choo/html');
const assets = require('../../common/assets');

module.exports = function(state) {
  return html`
    <div
      id="download-complete"
      class="flex flex-col items-center justify-center h-full w-full bg-white p-2 dark:bg-grey-90"
    >
      <h1 class="text-center text-3xl font-bold my-2">
        ${state.translate('downloadFinish')}
      </h1>
      <img src="${assets.get('completed.svg')}" class="my-8 h-48" />
      <p class="my-5">
        <a href="/" class="btn rounded-lg flex items-center mt-4" role="button"
          >${state.translate('okButton')}</a
        >
      </p>
      <p class="">
        <a href="/report" class="link-blue">${state.translate('reportFile')}</a>
      </p>
    </div>
  `;
};
