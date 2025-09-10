import { addonBuilder } from 'stremio-addon-sdk'
import fetch from 'node-fetch'

const TMDB_API_KEY = process.env.TMDB_API_KEY || ''
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
  const j = await r.json()
  return j.translatedText || text
}

const manifest = {
  id: 'org.stremio.addon.traductor-es',
  version: '1.0.0',
  name: 'Traductor ES - Stremio',
  description: 'Traduce descripciones de películas y series al español',
  resources: ['meta'],
  types: ['movie', 'series'],
  idPrefixes: ['tt']
}

const builder = new addonBuilder(manifest)

builder.defineMetaHandler(async ({ id }) => {
  const original = `Descripción original de ${id}`
  const translated = await translateToSpanish(original)
  return {
    id,
    type: 'movie',
    name: `Título ${id}`,
    description: translated
  }
})

const addonInterface = builder.getInterface()

export default function handler(req, res) {
  return addonInterface(req, res)
}