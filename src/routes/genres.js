import express from 'express';
import { getGenres } from '../services/igdb.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const genres = await getGenres();
    res.json(genres.map(g => ({ id: g.id, name: g.name })));
  } catch (err) {
    res.status(502).json({ error: 'Failed to fetch genres' });
  }
});

export default router;
