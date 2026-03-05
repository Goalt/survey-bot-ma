/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_VCONSOLE: 'true' | 'false' | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
