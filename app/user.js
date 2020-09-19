import assets from '../common/assets';

export default class User {
  constructor(storage, limits, authConfig) {
    this.authConfig = authConfig;
    this.limits = limits;
    this.storage = storage;
    this.data = storage.user || {};
  }

  get info() {
    return this.data || this.storage.user || {};
  }

  set info(data) {
    this.data = data;
    this.storage.user = data;
  }

  get avatar() {
    const defaultAvatar = assets.get('user.svg');
    if (this.info.avatarDefault) {
      return defaultAvatar;
    }
    return this.info.avatar || defaultAvatar;
  }

  get bearerToken() {
    return this.info.access_token;
  }

  get refreshToken() {
    return this.info.refresh_token;
  }

  get maxSize() {
    return this.limits.ANON.MAX_FILE_SIZE;
  }

  get maxExpireSeconds() {
    return this.limits.ANON.MAX_EXPIRE_SECONDS;
  }

  get maxDownloads() {
    return this.limits.ANON.MAX_DOWNLOADS;
  }

  toJSON() {
    return this.info;
  }
}
