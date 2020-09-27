const html = require('choo/html');
const Component = require('choo/component');

class Footer extends Component {
  constructor(name, state, emit) {
    super(name);
    this.state = state;
    this.emit = emit;
  }

  update() {
    return false;
  }

  createElement() {
    return html`
      <footer
        class="flex flex-col md:flex-row items-start w-full flex-none self-start p-6 md:p-8 font-medium text-xs text-grey-60 dark:text-grey-40 md:items-center justify-between"
      >
        <div class="m-2">
          ${this.state.user.loggedIn
            ? html`
              <button
                onclick="${event => {
                  event.stopPropagation();
                  this.emit('logout');
                }}"
              />logout</button>
            `
            : ''}
        </div>
        <ul
          class="flex flex-col md:flex-row items-start md:items-center md:justify-end"
        >
          <li class="m-2">
            <a href="https://github.com/komachi/icsend">GitHub </a>
          </li>
        </ul>
      </footer>
    `;
  }
}

module.exports = Footer;
