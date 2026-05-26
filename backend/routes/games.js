import express from 'express';
import * as GamesController from '../controllers/games.js';
const router = express.Router();

function handleError(res, error) {
    res.status(error.status || 500).json({
        message: error.message || 'Internal Server Error',
        details: error.errors || []
    });
}

//Routes with prefix /games

router.get("/", async (req, res) => {
    try             { res.status(200).json(await GamesController.getAllGames(req.query));}
    catch (error)   { handleError(res, error); }
});

router.get("/:gameId", async (req, res) => {
    try {
        const game = await GamesController.getGameById(req.params.gameId);
        return (!game) ? res.status(404).json({message: 'Game not found', details: [] }) : res.status(200).json(game);
    } catch (error) { handleError(res, error); }
});

router.post("/", async (req, res) => {
    try             {   res.status(201).json(await GamesController.addGame(req.body));}
    catch (error)   {   handleError(res, error); }
});

router.put("/:gameId", async (req, res) => {
    try             {   res.status(200).json(await GamesController.updateGame(req.params.gameId, req.body));}
    catch (error)   {   handleError(res, error); }
});

router.delete("/:gameId", async (req, res) => {
    try             { res.status(200).json(await GamesController.deleteGame(req.params.gameId));}
    catch (error)   { handleError(res, error); }
});

export default router;