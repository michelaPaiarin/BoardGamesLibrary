import express, { json } from 'express';
import * as GamesController from '../controllers/games.js';
const router = express.Router();

//Routes with prefix /games

router.get("/", async (req, res) => {
    try {
        res.status(200).json(await GamesController.getAllGames(req.query));
    }catch (error) {
        res.status(error.status || 500).json({error: error.message || 'Internal Server Error'});
    }
});

router.get("/:gameId", async (req, res) => {
    try {
        const game = await GamesController.getGameById(req.params.gameId);
        return (!game) ? res.status(404).json({ error: 'Game not found' }) : res.status(200).json(game);
    } catch (error) {
        res.status(error.status || 500).json({error: error.message || 'Internal Server Error'});
    }
});

router.post("/", json(), async (req, res) => {
    try {
        res.status(201).json(await GamesController.addGame(req.body));
    } catch (error) {
        res.status(error.status || 500).json({error: error.message || 'Internal Server Error'});
    }
});

router.put("/:gameId", json(), async (req, res) => {
    try {
        res.status(200).json(await GamesController.updateGame(req.params.gameId, req.body));
    } catch (error) {
        res.status(error.status || 500).json({error: error.message || 'Internal Server Error'});
    }
});

router.delete("/:gameId", async (req, res) => {
    try {
        res.status(200).json(await GamesController.deleteGame(req.params.gameId));
    } catch (error) {
        res.status(error.status || 500).json({error: error.message || 'Internal Server Error'});
    }
});

export default router;