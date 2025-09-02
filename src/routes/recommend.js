import express from 'express';
import { getGameDetails, getGamesByIds, getTopGamesByGenre } from '../services/igdb.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { lastPlayedGameId, desiredGenreId } = req.body;
  if (!lastPlayedGameId || !desiredGenreId) {
    return res.status(400).json({ error: 'Missing lastPlayedGameId or desiredGenreId' });
  }
  try {
    const lastGame = await getGameDetails(lastPlayedGameId);
    let similarIds = (lastGame.similar_games || []);
    let similarGames = await getGamesByIds(similarIds);

    // Filter by genre
    let filtered = similarGames.filter(g =>
      g.genres && g.genres.some(genre => genre.id === desiredGenreId)
    );

    // Fallback: top games in genre
    if (filtered.length < 5) {
      const topGames = await getTopGamesByGenre(desiredGenreId);
      // Avoid duplicates
      const existingIds = new Set(filtered.map(g => g.id));
      for (const g of topGames) {
        if (!existingIds.has(g.id)) filtered.push(g);
        if (filtered.length >= 10) break;
      }
    }

    // Format output
    const result = filtered.slice(0, 10).map(g => ({
      id: g.id,
      name: g.name,
      coverImage: g.cover ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${g.cover.image_id}.jpg` : null,
      genres: g.genres ? g.genres.map(genre => genre.name) : [],
      summary: g.summary,
      releaseYear: g.first_release_date ? new Date(g.first_release_date * 1000).getFullYear() : null,
      platforms: g.platforms ? g.platforms.map(p => p.name) : []
    }));

    res.json(result);
  } catch (err) {
    res.status(502).json({ error: 'Failed to fetch recommendations' });
  }
});

export default router;
