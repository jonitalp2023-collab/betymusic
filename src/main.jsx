import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './style.css';

// Betty Music is served from GitHub Pages; remove any stale offline worker
// that could keep an outdated or incomplete app shell in the browser.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(registration => registration.unregister()));
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.filter(key => key.startsWith('betty-music-')).map(key => caches.delete(key)));
      }
    } catch (error) {
      console.warn('No se pudo limpiar la caché anterior:', error);
    }
  });
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
