import * as GamesModel from '../models/games.js';
import * as GamesValidator from '../validators/games.js';

export async function getAllGames(filters) {
    let areEmptyFilters = filters && Object.keys(filters).length === 0;
    
    try {
        return areEmptyFilters
                ? await GamesModel.getAllGames()
                : await GamesModel.getGameFiltered(filters);
    } catch (error) {
        throw error;
    }
}

export async function getGameById(gameId) {
    let validation = GamesValidator.validateID(gameId);
    if (!validation.valid) {
        throw {status: 400, message: validation.message};
    }

    try { return await GamesModel.getGameById(gameId); }
    catch (error) { throw error; }
}    

export async function addGame(game) {
    let validation = GamesValidator.validateGame(game);
    if (!validation.valid) { throw {status: 400, message: validation.message}; }
    
    try { return await GamesModel.addGame(game); }
    catch (error) { throw error; }
}

export async function updateGame(gameId, game) {
    let idValidation = GamesValidator.validateID(gameId);
    if (!idValidation.valid) { throw {status: 400, message: idValidation.message};}

    let gameValidation = GamesValidator.validateGame(game);
    if (!gameValidation.valid) { throw {status: 400, message: gameValidation.message};}
    
    try { return await GamesModel.updateGame(gameId, game);}
    catch (error) { throw error; }
}

export async function deleteGame(gameId) {
    let validation = GamesValidator.validateID(gameId);
    if (!validation.valid) { throw {status: 400, message: validation.message}; }
    
    try { return await GamesModel.deleteGame(gameId); }
    catch (error) { throw error; }
}

export default {
    getAllGames, getGameById, addGame, updateGame, deleteGame
}