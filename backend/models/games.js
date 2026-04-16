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


export default {
    getAllGames,
    getGameById,
    getGameFiltered
}