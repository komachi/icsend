import { login, logout } from './api';

export default class User {
  constructor(storage, limits, authConfig) {
    this.authConfig = authConfig;
    this.limits = limits;
    this.storage = storage;
    this.data = storage.user || {};
    this.loggedIn = false;
    this.tokenLoginError = false;
  }

  get info() {
    return this.data || this.storage.user || {};
  }

  set info(data) {
    this.data = data;
    this.storage.user = data;
  }

  get bearerToken() {
    return this.info.access_token;
  }

  get refreshToken() {
    return this.info.refresh_token;
  }

  get maxSize() {
    return this.loggedIn
      ? this.limits.MAX_FILE_SIZE
      : this.limits.ANON.MAX_FILE_SIZE;
  }

  get maxExpireSeconds() {
    return this.loggedIn
      ? this.limits.MAX_EXPIRE_SECONDS
      : this.limits.ANON.MAX_EXPIRE_SECONDS;
  }

  get maxDownloads() {
    return this.loggedIn
      ? this.limits.MAX_DOWNLOADS
      : this.limits.ANON.MAX_DOWNLOADS;
  }

  async tokenLogin(token) {
    const clientSalt = process.env.TOKEN_AUTH_CLIENT_SALT;
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(token),
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );

    const keyBuffer = await window.crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: new TextEncoder().encode(`${clientSalt}:token`),
        iterations: 500000,
        hash: 'SHA-512'
      },
      keyMaterial,
      512
    );

    const key = Array.from(new Uint8Array(keyBuffer))
      .map(byte => String.fromCharCode(byte))
      .join('');

    const b64encoded = btoa(key);
    try {
      const response = await login(b64encoded);
      this.loggedIn = response;
      this.tokenLoginError = !response;
    } catch (error) {
      this.tokenLoginError = true;
    }
  }

  async logout() {
    const response = await logout();
    this.loggedIn = !response;
  }

  toJSON() {
    return this.info;
  }
}
