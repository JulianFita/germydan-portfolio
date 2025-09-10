import fetch from 'node-fetch'

const TMDB_API_KEY = process.env.TMDB_API_KEY || ''
const OMDB_API_KEY = process.env.OMDB_API_KEY || ''
const LIBRE_API_URL = process.env.LIBRE_API_URL || 'https://libretranslate.com'
const LIBRE_API_KEY = process.env.LIBRE_API_KEY || ''

async function translateToSpanish(text) {
  if (!text) return text
  const body = { q: text, source: 'auto', target: 'es', format: 'text' }
  if (LIBRE_API_KEY) body.api_key = LIBRE_API_KEY
  const r = await fetch(`${LIBRE_API_URL}/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  const data = await r.json()
  return data.translatedText || text
}

async function fetchFromTMDBByImdb(imdbId) {
  const r = await fetch(`https://api.themoviedb.org/3/find/${imdbId}?api_key=${TMDB_API_KEY}&language=en-US&external_source=imdb_id`)
  const j = await r.json()
  return j.movie_results?.[0] || j.tv_results?.[0] || {}
}

export default async function handler(req, res) {
  const { id } = req.query
  if (!id) return res.status(400).json({ error: 'missing id' })

  let originalOverview = 'Descripción no disponible'
  let title = ''
  let year = ''
  let type = 'movie'

  try {
    if (TMDB_API_KEY && id.startsWith('tt')) {
      const tmdbData = await fetchFromTMDBByImdb(id)
      originalOverview = tmdbData.overview || originalOverview
      title = tmdbData.title || tmdbData.name || ''
      year = (tmdbData.release_date || tmdbData.first_air_date || '').split('-')[0] || ''
      type = tmdbData.name ? 'series' : 'movie'
    }
    const translated = await translateToSpanish(originalOverview)
    return res.status(200).json({
      id,
      name: title || id,
      type,
      description: translated,
      descriptionFull: translated,
      year
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}