import axios from 'axios';
import { Game, Genre, SearchResult } from '../types/game';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const gameApi = {
  searchGames: async (query: string): Promise<SearchResult[]> => {
    const response = await api.get(`/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  getGenres: async (): Promise<Genre[]> => {
    const response = await api.get('/genres');
    return response.data;
  },

  getRecommendations: async (lastPlayedGameId: number, desiredGenreId: number): Promise<Game[]> => {
    const response = await api.post('/recommend', {
      lastPlayedGameId,
      desiredGenreId
    });
    return response.data;
  }
};