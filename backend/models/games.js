import { getDB } from "../DB/database.js";

const baseSelctQuery = 'SELECT * FROM games';

export async function getAllGames() {
    console.log('Fetching all games');
    try {
        return await getDB().all(baseSelctQuery);
    } catch (error) {
        console.error('Error fetching games:', error);
        throw error;
    }
}

export async function getGameById(gameId) {
    console.log(`Fetching game with ID: ${gameId}`);
    try {
        return await getDB().get(baseSelctQuery + " WHERE ID = ?", [gameId]);
    } catch (error) {
        console.error('Error fetching game:', error);
        throw error;
    }
}

export async function getGameFiltered(filters) {
    console.log('Fetching games with filters:', filters);
    try {
        console.log('thinking about how to build the query');
        return ('thinking about how to build the query for now no filtering!');
    } catch (error) {
        console.error('Error fetching filtered games:', error);
        throw error;
    }
}

export async function addGame(game) {
    console.log('Adding new game:', game);
    return { message: 'Game added successfully (not really, this is just a placeholder)' };
}

export async function updateGame(gameId, game) {
    console.log(`Updating game with ID: ${gameId}`, game);
    return { message: 'Game updated successfully (not really, this is just a placeholder)' };
}

export async function deleteGame(gameId) {
    console.log(`Deleting game with ID: ${gameId}`);
    return { message: 'Game deleted successfully (not really, this is just a placeholder)' };
}

export default {
    getAllGames, getGameById, getGameFiltered, addGame, updateGame, deleteGame
}