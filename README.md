# Betty Music 🎵

Aplicación web de música con identidad visual rosa. Permite buscar videos musicales mediante YouTube Data API, guardar favoritos y reproducirlos con el reproductor oficial de YouTube.

## Ejecutar en desarrollo

```bash
npm install
npm run dev
```

## Búsqueda de canciones

1. Crear una clave en Google Cloud y habilitar **YouTube Data API v3**.
2. Abrir Betty Music, entrar en Configuración y pegar la clave.
3. Buscar artistas o canciones. La reproducción utiliza el reproductor oficial embebido de YouTube.

La clave se guarda en el almacenamiento local del navegador. Para una publicación pública conviene implementar un backend que proteja la clave y aplique límites de uso.
