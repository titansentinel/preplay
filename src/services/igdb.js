import axios from 'axios';
import config from '../config/igdb.js';
import cache from './cache.js';

let accessToken = null;
let tokenExpiry = 0;

async function getAccessToken() {
  if (accessToken && Date.now() < tokenExpiry - 60000) {
    return accessToken;
  }
  const params = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    grant_type: 'client_credentials'
  });
  const res = await axios.post(`${config.twitchTokenUrl}?${params}`);
  accessToken = res.data.access_token;
  tokenExpiry = Date.now() + res.data.expires_in * 1000;
  return accessToken;
}

async function igdbRequest(endpoint, data) {
  const token = await getAccessToken();
  const res = await axios.post(
    `${config.igdbApiUrl}/${endpoint}`,
    data,
    {
      headers: {
        'Client-ID': config.clientId,
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    }
  );
  return res.data;
}

export async function searchGames(query) {
  const data = `search "${query}"; fields id,name,cover.image_id; limit 10;`;
  return igdbRequest('games', data);
}

export async function getGenres() {
  const cached = cache.get('genres');
  if (cached) return cached;
  const data = 'fields id,name; limit 100;';
  const genres = await igdbRequest('genres', data);
  cache.set('genres', genres, 86400); // cache for 24h
  return genres;
}

export async function getGameDetails(gameId) {
  const data = `fields id,name,cover.image_id,genres.name,genres.id,summary,first_release_date,platforms.name,similar_games; where id = ${gameId};`;
  const games = await igdbRequest('games', data);
  return games[0];
}

export async function getGamesByIds(ids) {
  if (!ids.length) return [];
  const data = `fields id,name,cover.image_id,genres.name,genres.id,summary,first_release_date,platforms.name; where id = (${ids.join(',')}); limit 20;`;
  return igdbRequest('games', data);
}

export async function getTopGamesByGenre(genreId) {
  const data = `fields id,name,cover.image_id,genres.name,genres.id,summary,first_release_date,platforms.name; where genres = (${genreId}); sort rating desc; limit 10;`;
  return igdbRequest('games', data);
}
