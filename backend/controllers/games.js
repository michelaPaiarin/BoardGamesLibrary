import * as GamesModel from '../models/games.js';
import { GamesValidator, FilterValidator } from '../sharedExports.js';

export async function getAllGames(filters) {
    if(!filters || Object.keys(filters).length === 0){return await GamesModel.getAllGames()}
    
    try                     { filters = FilterValidator.cleanFilter(filters);}
    catch(error)            { throw { status: 400, message: error.message }; }
    
    let validation = FilterValidator.validateFilter(filters);
    if (!validation.valid)  { throw { status: 400, message: 'Invalid filter', errors: validation.errors}; }

    try             { return await GamesModel.getGameFiltered(filters); }
    catch (error)   { throw error; }
}

function checkValidId(id) {
    const validation = GamesValidator.validateID(id);
    if (!validation.valid) { throw { status: 400, message: 'Invalid ID format', errors: validation.errors }; }
}

async function checkValidGame(game, isUpdate = false, gameId = null) {
    try                                                 { game = GamesValidator.cleanGameData(game);     }
    catch(error)                                        { throw { status: 400, message: error.message }; }

    let validation = GamesValidator.validateGame(game);
    if (!validation.valid)  { throw { status: 400, message: 'Invalid game data', errors: validation.errors}; }

    if (game.Name) {
        let existingGame = (await GamesModel.getGameByName(game.Name, true))[0];
        if (existingGame && (!isUpdate || existingGame['ID'] !== parseInt(gameId))) {
            throw { status: 409, message: 'A game with the same name already exists' };
        }
    }
}

export async function getGameById(gameId) {
    checkValidId(gameId);

    try                     { return await GamesModel.getGameById(gameId); }
    catch (error)           { throw error; }
}    

export async function addGame(game) {    
    await checkValidGame(game);

    try                     { return await GamesModel.addGame(game); }
    catch (error)           { throw error; }
}

export async function updateGame(gameId, game) {
    checkValidId(gameId);
    if (Object.keys(game).length === 0)                 { throw { status: 400, message: 'No fields provided to update' }; }

    const existingID = await GamesModel.getGameById(gameId);
    if (!existingID)                                    { throw { status: 404, message: 'No game found with the provided ID' }; }

    await checkValidGame(game, true, gameId);
    
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

export default { getAllGames, getGameById, addGame, updateGame, deleteGame }