import * as GamesModel from '../models/games.js';
import * as GamesValidator from '../validators/games.js';

export async function getAllGames(filters) {
    let areEmptyFilters = filters && Object.keys(filters).length === 0;
    
    try             { return areEmptyFilters
                        ? await GamesModel.getAllGames()
                        : await GamesModel.getGameFiltered(filters); }
    catch (error)   { throw error; }
}

export async function getGameById(gameId) {
    let validation = GamesValidator.validateID(gameId);

    if (!validation.valid)  { throw {status: 400, message: validation.message}; }
    try                     { return await GamesModel.getGameById(gameId); }
    catch (error)           { throw error; }
}    

export async function addGame(game) {
    try                     { game = GamesValidator.cleanGameData(game);}
    catch(error)            { throw { status: 400, message: error.message }; }
    
    let validation = GamesValidator.validateGame(game);
    if (!validation.valid)  { throw { status: 400, message: validation.message}; }

    let existingGame = (await GamesModel.getGameByName(game.Name, true))[0];
    if (existingGame)       { throw { status: 409, message: 'A game with the same name already exists' }; }

    try                     { return await GamesModel.addGame(game); }
    catch (error)           { throw error; }
}

export async function updateGame(gameId, game) {
    let idValidation = GamesValidator.validateID(gameId);
    if (!idValidation.valid)                            { throw { status: 400, message: idValidation.message};}

    try                                                 { game = GamesValidator.cleanGameData(game);}
    catch(error)                                        { throw { status: 400, message: error.message }; }

    let gameValidation = GamesValidator.validateGame(game, true);
    if (!gameValidation.valid)                          { throw {status: 400, message: gameValidation.message};}
    
    if (Object.keys(game).length === 0)                 { throw { status: 400, message: 'No fields provided to update' }; }
    if (game.Name) {
        let existingGame = (await GamesModel.getGameByName(game.Name, true))[0];
        if (existingGame && existingGame['ID'] !== parseInt(gameId) ){ throw { status: 409, message: 'A game with the same name already exists' }; }
    }

    try { return await GamesModel.updateGame(gameId, game);}
    catch (error) {
        if (error.message === 'GAME_NOT_FOUND')         { throw { status: 404, message: 'No game found with the provided ID' };}
        if (error.message === 'NO_FIELDS_TO_UPDATE')    { throw { status: 400, message: 'No fields provided to update' }; }
        throw error;
    }
}

export async function deleteGame(gameId) {
    let validation = GamesValidator.validateID(gameId);
    
    if (!validation.valid)                              { throw {status: 400, message: validation.message}; }
    try                                                 { return await GamesModel.deleteGame(gameId); }
    catch (error) { 
        if (error.message === 'GAME_NOT_FOUND')         { throw { status: 404, message: 'No game found with the provided ID' };}
        throw error; 
    }
}

export default {
    getAllGames, getGameById, addGame, updateGame, deleteGame
}