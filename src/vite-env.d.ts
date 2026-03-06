/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_VCONSOLE: 'true' | 'false' | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  __APP_CONFIG__?: {
    VITE_VCONSOLE?: string;
    API_URL?: string;
    SENTRY_DSN?: string;
  };
}
