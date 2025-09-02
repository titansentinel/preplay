import express from 'express';
import { searchGames } from '../services/igdb.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Missing query parameter: q' });
  try {
    const games = await searchGames(q);
    const result = games.map(g => ({
      id: g.id,
      name: g.name,
      coverImage: g.cover ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${g.cover.image_id}.jpg` : null
    }));
    res.json(result);
  } catch (err) {
    res.status(502).json({ error: 'Failed to fetch from IGDB' });
  }
});

export default router;
