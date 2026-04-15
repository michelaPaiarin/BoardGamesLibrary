import express from 'express';
import { getAllGames } from '../models/games.js';
const router = express.Router();

//Routes with prefix /games

router.get("/", (req, res) => {
    getAllGames()
        .then(games => {
            res.status(200).json(games);
        })
        .catch(error => {
            console.error('Error fetching games:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

export default router;