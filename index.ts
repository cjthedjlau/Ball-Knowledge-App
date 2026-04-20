import { registerRootComponent } from 'expo';

// Global unhandled promise rejection handler
if (typeof global !== 'undefined') {
  const originalHandler = (global as any).onunhandledrejection;
  (global as any).onunhandledrejection = (event: any) => {
    console.error('[Global] Unhandled promise rejection:', event?.reason);
    if (originalHandler) originalHandler(event);
  };
}

import App from './App';

try {
  registerRootComponent(App);
} catch (e) {
  console.error('[FATAL] registerRootComponent crashed:', e);
}
