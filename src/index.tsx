import { retrieveLaunchParams } from '@telegram-apps/sdk-react';
import '@telegram-apps/telegram-ui/dist/styles.css';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import { App } from '@/App.tsx';
import { EnvUnsupported } from '@/components/EnvUnsupported.tsx';
import { init } from '@/init.ts';

import './index.css';

// Mock the environment in case, we are outside Telegram.
import './mockEnv.ts';

const root = ReactDOM.createRoot(document.getElementById('root')!);

try {
  // Configure all application dependencies.
  init(retrieveLaunchParams().startParam === 'debug' || import.meta.env.DEV);

  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
} catch (e) {
  root.render(<EnvUnsupported />);
}
