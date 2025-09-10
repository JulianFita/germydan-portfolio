const { addonBuilder } = require('stremio-addon-sdk')
const fetch = require('node-fetch')

const TMDB_API_KEY = process.env.TMDB_API_KEY || ''
const OMDB_API_KEY = process.env.OMDB_API_KEY || ''
const LIBRE_API_URL = process.env.LIBRE_API_URL || 'https://libretranslate.com'
const LIBRE_API_KEY = process.env.LIBRE_API_KEY || ''

async function translateToSpanish(text) {
  if (!text) return text
  try {
    const body = { q: text, source: 'auto', target: 'es', format: 'text' }
    if (LIBRE_API_KEY) body.api_key = LIBRE_API_KEY
    const r = await fetch(`${LIBRE_API_URL}/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    if (!r.ok) throw new Error('LibreTranslate status ' + r.status)
    const j = await r.json()
    return j.translatedText || j.translated || text
  } catch (e) {
    console.error('translate error', e)
    return text
  }
}

const manifest = {
  id: 'org.stremio.addon.traductor-es',
  version: '1.0.0',
  name: 'Traductor ES - Stremio',
  description: 'Traduce descripciones de películas y series al español',
  resources: ['meta'],
  types: ['movie','series'],
  idPrefixes: ['tt','imdb:','tmdb:']
}

const builder = new addonBuilder(manifest)

builder.defineMetaHandler(async ({ id }) => {
  try {
    let originalOverview = ''
    let title = id
    let year = ''
    let type = 'movie'

    if (OMDB_API_KEY && id.startsWith('tt')) {
      const r = await fetch(`http://www.omdbapi.com/?i=${id}&plot=full&apikey=${OMDB_API_KEY}`)
      const j = await r.json()
      if (j && j.Response !== 'False') {
        originalOverview = j.Plot || ''
        title = j.Title || title
        year = j.Year || ''
        type = j.Type === 'series' ? 'series' : 'movie'
      }
    } else if (TMDB_API_KEY && id.startsWith('tt')) {
      const find = await fetch(`https://api.themoviedb.org/3/find/${id}?api_key=${TMDB_API_KEY}&language=en-US&external_source=imdb_id`)
      const fj = await find.json()
      const item = fj.movie_results?.[0] || fj.tv_results?.[0]
      if (item) {
        const detailUrl = item.title
          ? `https://api.themoviedb.org/3/movie/${item.id}?api_key=${TMDB_API_KEY}&language=en-US`
          : `https://api.themoviedb.org/3/tv/${item.id}?api_key=${TMDB_API_KEY}&language=en-US`
        const dr = await fetch(detailUrl)
        const dj = await dr.json()
        originalOverview = dj.overview || ''
        title = dj.title || dj.name || title
        year = (dj.release_date || dj.first_air_date || '').split('-')[0] || ''
        type = dj.name ? 'series' : 'movie'
      }
    }

    if (!originalOverview) originalOverview = 'Descripción no disponible'
    const translated = await translateToSpanish(originalOverview)

    return {
      id,
      name: title,
      type,
      description: translated,
      descriptionFull: translated,
      year
    }
  } catch (err) {
    console.error('meta handler error', err)
    return { id, name: id, type: 'movie', description: 'Error interno: ' + (err.message || err) }
  }
})

const addonInterface = builder.getInterface()

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') { res.statusCode = 200; res.end(); return; }

  return addonInterface(req, res)
}
