const html = require('choo/html');
const Component = require('choo/component');
const assets = require('../../common/assets');
const { platform } = require('../utils');

class Header extends Component {
  constructor(name, state, emit) {
    super(name);
    this.state = state;
    this.emit = emit;
  }

  update() {
    return false;
  }

  createElement() {
    const title =
      platform() === 'android'
        ? html`
            <a class="flex flex-row items-center">
              <img src="${assets.get('icon.svg')}" />
              <h1 class="text-3xl font-medium md:pl-1 logo">icsend</h1>
            </a>
          `
        : html`
            <a class="flex flex-row items-center" href="/">
              <img
                alt="${this.state.translate('title')}"
                src="${assets.get('icon.svg')}"
              />
              <h1 class="text-3xl font-medium md:pl-1 logo">icsend</h1>
            </a>
          `;
    return html`
      <header
        class="main-header relative flex-none flex flex-row items-center justify-between w-full px-6 md:px-8 h-16 md:h-24 z-20 bg-transparent"
      >
        ${title}
      </header>
    `;
  }
}

module.exports = Header;
