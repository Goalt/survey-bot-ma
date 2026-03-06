const BACKEND_API_URL = window.__APP_CONFIG__?.API_URL || import.meta.env.VITE_API_URL || '';
const SENTRY_DSN = window.__APP_CONFIG__?.SENTRY_DSN || import.meta.env.VITE_SENTRY_DSN || '';
const ENVIRONMENT = 'production';

export { BACKEND_API_URL, SENTRY_DSN, ENVIRONMENT };
