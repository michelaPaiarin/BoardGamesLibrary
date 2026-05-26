export class ApiError extends Error {
    constructor(message, status = null, details = []) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.details = details;
    }
}

async function runRoute(route, options = {}) {
    try {
        const response = await fetch(route, options);

        if (!response.ok){
            let errorData;
            try      { errorData = await response.json();                           }
            catch(e) { errorData = { message: response.statusText, details: [] };   }
            throw new ApiError( errorData.message || `HTTP Error ${response.status}`, response.status || null, errorData.details || []);
        } 

        return await response.json();
    }catch (error){
        console.error(`Error fetching ${route}: ${error.status} ( ${error.message})`);
        throw error;
    }
}

function buildQueryString(filters) {
    const params = Object.entries(filters)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`);
    return '?' + params.join('&');
}

export async function getAllGames(filter = {}) {
    const hasFilters = Object.keys(filter).length > 0;
    const queryString = hasFilters ? buildQueryString(filter) : '';
    return await runRoute(`/games${queryString}`);
}

export async function getGameById(id) {
    return await runRoute(`/games/${id}`);
}

export async function postGame(gameData) {
    return await runRoute('/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gameData)
    });
}

export async function putGame(id, gameData) {
    return await runRoute(`/games/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gameData)
    });
}

export async function deleteGame(id) {
    return await runRoute(`/games/${id}`, {
        method: 'DELETE'
    });
}

export default {
    getAllGames, getGameById, postGame, putGame, deleteGame
}