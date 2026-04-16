import express, { json } from 'express';
import * as GamesModel from '../models/games.js';
const router = express.Router();

//Routes with prefix /games

router.get("/", async (req, res) => {
    console.log(req.query);
    let filters = req.query;
    let areEmptyFilters = filters && Object.keys(filters).length === 0;
    try {
        res.status(200).json(areEmptyFilters ? await GamesModel.getAllGames() : await GamesModel.getGameFiltered(filters));
    } catch (error) {
        console.error('Error fetching games:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get("/:gameId", async (req, res) => {
    try {
        const game = await GamesModel.getGameById(req.params.gameId);
        return (!game) ? res.status(404).json({ error: 'Game not found' }) : res.status(200).json(game);
    } catch (error) {
        console.error('Error fetching game:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;