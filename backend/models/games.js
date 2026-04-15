import { getDB } from "../DB/database.js";

export async function getAllGames() {
    try {
        const games = await getDB().all('SELECT * FROM games');
        return games;
    } catch (error) {
        console.error('Error fetching games:', error);
        throw error;
    }
}