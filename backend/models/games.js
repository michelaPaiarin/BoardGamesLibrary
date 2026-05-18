import { getDB } from "../DB/database.js";
import { GAME_CONSTRAINTS } from "../sharedExports.js";
import { buildWhereClause } from "./queryBuilder.js";

const GameFields = GAME_CONSTRAINTS.Fields;
const baseSelect = 'SELECT *';
const baseFrom = 'FROM games';
const baseSelectQuery = baseSelect + ' ' + baseFrom;

async function getGames(select, from, where = '', valueArray = null){
    try {
        const query = `${select} ${from} ${where}`.trim();
        if (valueArray === null){
            return await getDB().all(query);
        }else{
            return await getDB().all(query, valueArray);
        }
    } catch (error) {
        console.error('Error fetching games:', error);
        throw error;
    }
}

export async function getAllGames() {
    console.log('Fetching all games');
    return await getGames(baseSelect, baseFrom);
}

export async function getGameById(gameId) {
    console.log(`Fetching game with ID: ${gameId}`);
    try {
        return await getDB().get(baseSelectQuery + " WHERE ID = ?", [gameId]);
    } catch (error) {
        console.error('Error fetching game:', error);
        throw error;
    }
}

export async function getGameByName(gameName, exactMatch = false) {
    console.log("Fetching game with name:", gameName, "Exact match:", exactMatch);
    return await getGames(baseSelect, baseFrom,
            (exactMatch ? " WHERE Name = ?" : " WHERE Name LIKE ?"),
            [exactMatch ? gameName : `%${gameName}%`]
        );
}

export async function getGameFiltered(filters) {
    console.log('Fetching games with filters:', filters);
    const { sqlClause, params } = buildWhereClause(filters);

    return await getGames(baseSelect, baseFrom, sqlClause, params);
}

export async function addGame(game) {
    console.log('Adding new game:', game);

    try {
        const result = await getDB().run(
            `INSERT INTO games (${GameFields.join(', ')}) VALUES (${GameFields.map(() => '?').join(', ')})`,
            GameFields.map(field => game[field] !== undefined ? game[field] : null)
        );
        return { status: 'success', message: 'Game added successfully', gameId: result.lastID };
    } catch (error) {
        console.error('Error adding game:', error);
        throw error;
    }
}

export async function updateGame(gameId, game) {
    console.log (`Updating game with ID: ${gameId}`, game);

    try {
        const fieldsToUpdate = GameFields.filter(field => game[field] !== undefined);
        if (fieldsToUpdate.length === 0) { throw new Error('SYSTEM_ERROR: updateGame called with no valid fields'); }
        
        const result = await getDB().run(
            `UPDATE games SET ${fieldsToUpdate.map(f => `${f} = ?`).join(', ')} WHERE ID = ?`,
            [...fieldsToUpdate.map(f => game[f]), gameId]
        );

        if (result.changes === 0) {
            console.log('No game found to update with ID:', gameId);
            throw new Error('GAME_NOT_FOUND');
        } else {
            return { status: 'success', message: 'Game updated successfully', changes: result.changes };
        }
    } catch (error) {
        console.error('Error updating game:', error);
        throw error;
    }
}

export async function deleteGame(gameId) {
    console.log(`Deleting game with ID: ${gameId}`);

    try {
        const result = await getDB().run(`DELETE FROM games WHERE ID = ?`, [gameId]);

        if (result.changes === 0) { 
            console.log('No game found to delete with ID:', gameId);
            throw new Error('GAME_NOT_FOUND');
        }else {
            return { status: 'success', message: 'Game deleted successfully', changes: result.changes };
        }
    } catch (error) {
        console.error('Error deleting game:', error);
        throw error;
    }
}

export default {
    getAllGames, getGameById, getGameFiltered, getGameByName, addGame, updateGame, deleteGame
}