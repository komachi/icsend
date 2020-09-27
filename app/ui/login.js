const html = require('choo/html');

module.exports = function(state, emit) {
  return html`
    <main class="main">
      <section
        class="relative h-full w-full p-6 md:p-8 md:rounded-xl md:shadow-big"
      >
        <div
          class="flex flex-col w-full max-w-sm h-full mx-auto items-center justify-center"
        >
          ${state.user.loggedIn
            ? html`
                <h1>already logged in</h1>
              `
            : html`
                <form onsubmit="${login}">
                  ${state.user.tokenLoginError
                    ? html`
                        <div class="px-4 py-3 mb-3 border-red-200" role="alert">
                          ${state.translate('tokenLoginError')}
                        </div>
                      `
                    : ''}
                  <input
                    type="password"
                    name="token"
                    class="w-full mb-3 border"
                  />
                  <input
                    type="submit"
                    class="btn rounded-lg w-full flex-shrink-0 focus:outline"
                    title="${state.translate('loginButton')}"
                    value="${state.translate('loginButton')}"
                  />
                </form>
              `}
        </div>
      </section>
    </main>
  `;

  function login(event) {
    event.stopPropagation();
    event.preventDefault();
    const form = event.target;
    emit('tokenLogin', { token: form.token.value });
  }
};
