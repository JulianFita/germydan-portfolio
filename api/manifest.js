import { addonBuilder } from 'stremio-addon-sdk'

const manifest = {
  id: 'org.stremio.addon.traductor-es',
  version: '1.0.0',
  name: 'Traductor ES - Stremio',
  description: 'Traduce descripciones de películas y series al español',
  resources: [ 'meta' ],
  types: [ 'movie', 'series' ],
  idPrefixes: [ 'tt', 'imdb:', 'tmdb:' ],
  catalogs: []
}

export default function handler(req, res) {
  res.status(200).json(manifest)
}