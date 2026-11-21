import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './style.css';

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(error => {
      console.error('No se pudo activar el modo sin conexión:', error);
    });
  });
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);