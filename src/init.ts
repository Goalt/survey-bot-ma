import "./instrument";
import { BACKEND_API_URL, SENTRY_DSN } from "./env";

import {
  backButton,
  viewport,
  themeParams,
  miniApp,
  initData,
  $debug,
  init as initSDK,
} from '@telegram-apps/sdk-react';
import VConsole from 'vconsole';

/**
 * Initializes the application and configures its dependencies.
 */
export function init(debug: boolean): void {
  // Set @telegram-apps/sdk-react debug mode.
  $debug.set(debug);

  // Initialize special event handlers for Telegram Desktop, Android, iOS, etc.
  // Also, configure the package.
  initSDK();

  console.info(
    `[init] API_URL=${BACKEND_API_URL ? '(set)' : '(not set)'}, SENTRY_DSN=${SENTRY_DSN ? '(set)' : '(not set)'}`,
  );

  const runtimeVConsoleEnvRaw = window.__APP_CONFIG__?.VITE_VCONSOLE;
  const runtimeVConsoleEnv = runtimeVConsoleEnvRaw === 'true' || runtimeVConsoleEnvRaw === 'false'
    ? runtimeVConsoleEnvRaw
    : undefined;
  const vConsoleEnv = runtimeVConsoleEnv ?? import.meta.env.VITE_VCONSOLE;
  const vConsoleEnvLog = typeof vConsoleEnv === 'undefined' ? '(not set)' : vConsoleEnv;
  console.info(`[init] VITE_VCONSOLE=${vConsoleEnvLog}`);

  // Add vConsole if enabled via VITE_VCONSOLE env variable.
  if (vConsoleEnv === 'true') {
    try {
      new VConsole();
    } catch (e) {
      console.error(e);
    }
  }

  // Check if all required components are supported.
  if (!backButton.isSupported() || !miniApp.isSupported()) {
    throw new Error('ERR_NOT_SUPPORTED');
  }

  // Mount all components used in the project.
  backButton.mount();
  miniApp.mount();
  themeParams.mount();
  initData.restore();
  void viewport
    .mount()
    .catch(e => {
      console.error('Something went wrong mounting the viewport', e);
    })
    .then(() => {
      viewport.bindCssVars();
    });

  // Define components-related CSS variables.
  miniApp.bindCssVars();
  themeParams.bindCssVars();
}
