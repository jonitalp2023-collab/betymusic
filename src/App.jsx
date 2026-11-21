import React, { useEffect, useState } from 'react';

const KEY_NAME = 'betty-youtube-api-key';

export default function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(KEY_NAME) || '');
  const [showSettings, setShowSettings] = useState(false);
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('betty-favorites') || '[]'));
  const [tab, setTab] = useState('buscar');

  useEffect(() => localStorage.setItem('betty-favorites', JSON.stringify(favorites)), [favorites]);

  async function searchMusic(event) {
    event.preventDefault();
    if (!query.trim()) return;
    if (!apiKey.trim()) {
      setError('Para buscar canciones dentro de Betty Music, primero agregá tu clave de YouTube Data API en Configuración.');
      setShowSettings(true);
      return;
    }
    setLoading(true); setError(''); setResults([]); setTab('buscar');
    try {
      const params = new URLSearchParams({ part: 'snippet', q: `${query} music`, type: 'video', videoCategoryId: '10', maxResults: '12', key: apiKey.trim() });
      const response = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'No se pudo realizar la búsqueda.');
      setResults((data.items || []).filter(item => item.id?.videoId).map(item => ({ id: item.id.videoId, title: item.snippet.title, channel: item.snippet.channelTitle, image: item.snippet.thumbnails?.medium?.url })));
      if (!data.items?.length) setError('No encontramos resultados. Probá con otro nombre.');
    } catch (err) { setError(err.message || 'Ocurrió un error al buscar.'); }
    finally { setLoading(false); }
  }

  function toggleFavorite(song) {
    setFavorites(current => current.some(item => item.id === song.id) ? current.filter(item => item.id !== song.id) : [...current, song]);
  }

  const visibleSongs = tab === 'favoritos' ? favorites : results;
  const isFavorite = song => favorites.some(item => item.id === song.id);

  return <main className="app-shell">
    <header className="topbar">
      <div className="brand"><div className="brand-mark">♫</div><div><h1>Betty Music</h1><p>Tu música, tu momento</p></div></div>
      <button className="settings-button" aria-label="Configuración" onClick={() => setShowSettings(true)}>⚙</button>
    </header>

    <section className="hero">
      <div className="hero-glow" />
      <span className="eyebrow">BIENVENIDA A TU ESPACIO MUSICAL</span>
      <h2>Sentí cada<br/><span>canción.</span></h2>
      <p>Buscá tus temas favoritos y disfrutalos acá.</p>
      <form className="search" onSubmit={searchMusic}>
        <span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="¿Qué querés escuchar?" aria-label="Buscar canciones"/><button type="submit" disabled={loading}>{loading ? '...' : 'Buscar'}</button>
      </form>
    </section>

    <nav className="tabs"><button className={tab === 'buscar' ? 'active' : ''} onClick={() => setTab('buscar')}>⌕　Buscar</button><button className={tab === 'favoritos' ? 'active' : ''} onClick={() => setTab('favoritos')}>♡　Favoritos</button></nav>

    <section className="content">
      <div className="section-heading"><div><span className="eyebrow">TU BIBLIOTECA</span><h3>{tab === 'favoritos' ? 'Tus favoritos' : 'Resultados'}</h3></div><span className="count">{visibleSongs.length} temas</span></div>
      {error && <div className="notice">{error}</div>}
      {!visibleSongs.length && !error && <div className="empty"><div className="empty-note">♫</div><h4>{tab === 'favoritos' ? 'Todavía no guardaste favoritos' : '¿Qué escuchamos hoy?'}</h4><p>{tab === 'favoritos' ? 'Tocá el corazón de una canción para guardarla.' : 'Escribí el nombre de un artista o una canción para comenzar.'}</p></div>}
      <div className="song-grid">{visibleSongs.map(song => <article className="song-card" key={song.id}>
        <button className="cover" onClick={() => setSelected(song)} aria-label={`Reproducir ${song.title}`}><img src={song.image} alt=""/><span className="play">▶</span></button>
        <div className="song-info"><button className="song-title" onClick={() => setSelected(song)}>{song.title}</button><p>{song.channel}</p></div>
        <button className={`heart ${isFavorite(song) ? 'saved' : ''}`} onClick={() => toggleFavorite(song)} aria-label="Guardar en favoritos">{isFavorite(song) ? '♥' : '♡'}</button>
      </article>)}</div>
    </section>

    {selected && <div className="player-backdrop" onClick={() => setSelected(null)}><section className="player-modal" onClick={e => e.stopPropagation()}><button className="close" onClick={() => setSelected(null)}>✕</button><div className="player-title"><span className="eyebrow">REPRODUCIENDO EN BETTY MUSIC</span><h3>{selected.title}</h3><p>{selected.channel}</p></div><div className="video-wrap"><iframe src={`https://www.youtube-nocookie.com/embed/${selected.id}?autoplay=1&rel=0`} title={selected.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen/></div><button className="favorite-wide" onClick={() => toggleFavorite(selected)}>{isFavorite(selected) ? '♥ En tus favoritos' : '♡ Agregar a favoritos'}</button></section></div>}

    {showSettings && <div className="player-backdrop" onClick={() => setShowSettings(false)}><section className="settings-modal" onClick={e => e.stopPropagation()}><button className="close" onClick={() => setShowSettings(false)}>✕</button><span className="eyebrow">PERSONALIZÁ TU APP</span><h3>Configuración</h3><label htmlFor="api-key">Clave de YouTube Data API</label><input id="api-key" type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="Pegá tu clave de API"/><p className="help">La clave se guarda solamente en este dispositivo. Se usa para buscar videos mediante la API oficial de YouTube.</p><button className="save-button" onClick={() => { localStorage.setItem(KEY_NAME, apiKey.trim()); setShowSettings(false); setError(''); }}>Guardar configuración</button><a href="https://console.cloud.google.com/apis/library/youtube.googleapis.com" target="_blank" rel="noreferrer">Abrir YouTube Data API en Google Cloud ↗</a></section></div>}
    <footer>Hecho con <span>♥</span> para disfrutar la música</footer>
  </main>;
}
