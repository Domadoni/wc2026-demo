import countriesData from './countries.js'
import englandData from './england.js'
import germanyData from './germany.js'
import franceData from './france.js'
import brazilData from './brazil.js'
import argentinaData from './argentina.js'
import spainData from './spain.js'
import south_koreaData from './south_korea.js'
import netherlandsData from './netherlands.js'
import squadsData from './squads.js'
import squadCountriesData from './squad_countries.js'

const TEAM_BY_SLUG = {
  england: englandData,
  germany: germanyData,
  france: franceData,
  brazil: brazilData,
  argentina: argentinaData,
  spain: spainData,
  south_korea: south_koreaData,
  netherlands: netherlandsData,
}

// Map country_id → team data
const TEAM_DATA = {}
for (const c of countriesData) {
  const slug = c.name.toLowerCase().replace(/ /g, '_')
  const mod = TEAM_BY_SLUG[slug]
  if (mod) TEAM_DATA[c.id] = mod
}

export const api = {
  countries: () => Promise.resolve(countriesData),
  matches: ({ country_id } = {}) => {
    const data = TEAM_DATA[country_id]
    return Promise.resolve({ items: data?.matches ?? [] })
  },
  players: ({ country_id } = {}) => {
    const data = TEAM_DATA[country_id]
    return Promise.resolve({ players: data?.players ?? [] })
  },
  squads: (country) => {
    if (country) {
      return Promise.resolve(squadsData.filter((p) => p.country_name === country))
    }
    return Promise.resolve(squadsData)
  },
  squadCountries: () => Promise.resolve(squadCountriesData),
  news: (teamName) => {
    const query = encodeURIComponent(`${teamName} football 2026 World Cup`)
    const rssUrl = encodeURIComponent(
      `https://news.google.com/rss/search?q=${query}&hl=en-GB&gl=GB&ceid=GB:en`
    )
    return fetch(`https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.items) return []
        return data.items.slice(0, 8).map((item) => ({
          source: item.source || 'Google News',
          title: item.title,
          summary: item.description
            ? item.description.replace(/<[^>]*>/g, '').slice(0, 200)
            : '',
          url: item.link,
          published_iso: item.pubDate,
        }))
      })
      .catch(() => [])
  },
}
