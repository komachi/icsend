const crypto = require('crypto');
const { tmpdir } = require('os');
const path = require('path');
const { randomBytes } = require('crypto');
const convict = require('convict');
convict.addFormat(require('convict-format-with-validator').ipaddress);
convict.addFormat(require('convict-format-with-validator').url);

const conf = convict({
  s3_bucket: {
    format: String,
    default: '',
    env: 'S3_BUCKET',
  },
  s3_endpoint: {
    format: String,
    default: '',
    env: 'S3_ENDPOINT',
  },
  s3_use_path_style_endpoint: {
    format: Boolean,
    default: false,
    env: 'S3_USE_PATH_STYLE_ENDPOINT',
  },
  gcs_bucket: {
    format: String,
    default: '',
    env: 'GCS_BUCKET',
  },
  expire_times_seconds: {
    format: Array,
    default: [300, 3600, 86400, 604800, Infinity],
    env: 'EXPIRE_TIMES_SECONDS',
  },
  default_expire_seconds: {
    format: Number,
    default: 300,
    env: 'DEFAULT_EXPIRE_SECONDS',
  },
  max_expire_seconds: {
    format: Number,
    default: Infinity,
    env: 'MAX_EXPIRE_SECONDS',
  },
  anon_max_expire_seconds: {
    format: Number,
    default: 10800,
    env: 'ANON_MAX_EXPIRE_SECONDS',
  },
  download_counts: {
    format: Array,
    default: [1, 2, 3, 4, 5, 20, 50, 100],
    env: 'DOWNLOAD_COUNTS',
  },
  max_downloads: {
    format: Number,
    default: Infinity,
    env: 'MAX_DOWNLOADS',
  },
  anon_max_downloads: {
    format: Number,
    default: 3,
    env: 'ANON_MAX_DOWNLOADS',
  },
  max_files_per_archive: {
    format: Number,
    default: 64,
    env: 'MAX_FILES_PER_ARCHIVE',
  },
  max_archives_per_user: {
    format: Number,
    default: 16,
    env: 'MAX_ARCHIVES_PER_USER',
  },
  redis_host: {
    format: String,
    default: 'mock',
    env: 'REDIS_HOST',
  },
  redis_retry_time: {
    format: Number,
    default: 10000,
    env: 'REDIS_RETRY_TIME',
  },
  redis_retry_delay: {
    format: Number,
    default: 500,
    env: 'REDIS_RETRY_DELAY',
  },
  listen_address: {
    format: 'ipaddress',
    default: '0.0.0.0',
    env: 'IP_ADDRESS',
  },
  listen_port: {
    format: 'port',
    default: 1443,
    arg: 'port',
    env: 'PORT',
  },
  env: {
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  max_file_size: {
    format: Number,
    default: 1024 * 1024 * 1024 * 5,
    env: 'MAX_FILE_SIZE',
  },
  anon_max_file_size: {
    format: Number,
    default: 1024 * 1024 * 20,
    env: 'ANON_MAX_FILE_SIZE',
  },
  l10n_dev: {
    format: Boolean,
    default: false,
    env: 'L10N_DEV',
  },
  base_url: {
    format: 'url',
    default: 'https://example.com',
    env: 'BASE_URL',
  },
  file_dir: {
    format: 'String',
    default: `${tmpdir()}${path.sep}send-${randomBytes(4).toString('hex')}`,
    env: 'FILE_DIR',
  },
  owner_token_hash: {
    format: String,
    default: '',
    env: 'OWNER_TOKEN_HASH',
  },
  owner_only: {
    format: Boolean,
    default: false,
    env: 'OWNER_ONLY',
  },
  session_secret: {
    format: String,
    default: crypto.randomBytes(64).toString('base64'),
    env: 'SESSION_SECRET',
  },
  token_auth_client_salt: {
    format: String,
    default: crypto.randomBytes(64).toString('base64'),
    env: 'TOKEN_AUTH_CLIENT_SALT',
  },
});

// Perform validation
conf.validate({ allowed: 'strict' });

const props = conf.getProperties();
module.exports = props;
