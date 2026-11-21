import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './style.css';

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    console.error('Error al iniciar Betty Music:', error);
  }

  render() {
    if (this.state.error) {
      return (
        <main style={{ minHeight: '100vh', padding: '32px 20px', background: '#fff8fb', color: '#482d3b', fontFamily: 'Arial, sans-serif' }}>
          <h1 style={{ color: '#bd5e8c' }}>Betty Music</h1>
          <h2>No pudimos cargar la aplicación</h2>
          <p>Encontramos un error al iniciar. Este es el detalle para poder corregirlo:</p>
          <pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', padding: '14px', background: '#ffe3ef', borderRadius: '12px' }}>{String(this.state.error?.message || this.state.error)}</pre>
          <button onClick={() => window.location.reload()} style={{ padding: '12px 18px', border: 0, borderRadius: '10px', background: '#8f456d', color: 'white' }}>Volver a intentar</button>
        </main>
      );
    }
    return this.props.children;
  }
}

// Retirar cualquier service worker viejo que pudiera servir archivos desactualizados.
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
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </React.StrictMode>
);
