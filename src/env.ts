const BACKEND_API_URL = window.__APP_CONFIG__?.API_URL || '';
const SENTRY_DSN = window.__APP_CONFIG__?.SENTRY_DSN || '';
const ENVIRONMENT = 'production';

export { BACKEND_API_URL, SENTRY_DSN, ENVIRONMENT };
