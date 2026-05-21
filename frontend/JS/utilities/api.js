export class ApiError extends Error {
    constructor(message, details = []) {
        super(message);
        this.name = "ApiError";
        this.status = this.status;
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

            throw new ApiError( errorData.message || `Errore HTTP ${response.status}`, errorData.details || [], response.status);
        } 

        return await response.json();
    }catch (error){
        console.error(`Errore durante la fetch verso ${route}:`, error);
        throw error;
    }
}

async function putJSONonID(route, id, options) {
    const outputDiv = document.querySelector(id);
    const response = await runRoute(route, options);
    outputDiv.textContent = JSON.stringify(response, null, 4);
}

export async function getAllGames() {
    return await runRoute('/games');
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