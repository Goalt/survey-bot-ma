/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_VCONSOLE: 'true' | 'false' | undefined;
  readonly VITE_API_URL: string | undefined;
  readonly VITE_SENTRY_DSN: string | undefined;
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
