import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Unconditionally clear caches and unregister service workers to solve aggressive mobile caching issues during updates
if ('caches' in window) {
  caches.keys().then((keys) => {
    keys.forEach((key) => {
      caches.delete(key).then(() => {
        console.log('[PWA] Deleted cache:', key);
      });
    });
  }).catch(err => console.warn('[PWA] Cache clearing failed:', err));
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister().then((success) => {
        if (success) {
          console.log('[PWA] Unregistered stale service worker successfully');
        }
      });
    }
  }).catch(err => console.warn('[PWA] Service worker unregistration failed:', err));
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
