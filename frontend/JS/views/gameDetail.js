import { loadModifiedGames, loadDetailGame } from "../main.js";
import { getGameById } from '../utilities/api.js';

const ID = {
    Name: 'game-name',
    Image: 'game-image',
    Players: 'game-players-val',
    Time: 'game-time-val',
    MinAge: 'game-age-val',
    Year: 'game-year-val',
    Description: 'game-description-text',
    Location: 'game-location-val',
}

// note: if error occurs the caller handle it
export async function fillGameDetails(id) {
    const game = await getGameById(id);
    await fillGameFormWithGame(game);
}

async function fillGameFormWithGame(game) {
    console.log("Riempio i dettagli del gioco:", game);

    for (const key in ID) {
        const element = document.getElementById(ID[key]);
        
        if (!element) { console.warn(`Elemento con ID ${ID[key]} non trovato per la chiave ${key}`); continue; }
        else{
            switch(key) {
                case 'Players': element.textContent = `${game.MinPlayer}-${game.MaxPlayer}`; break;
                case 'Image': element.src = game.UrlBigImage || './IMG/placeholder.jpg'; element.alt = game.Name; break;
                default: element.textContent =  game[key] || 'N/D'; break;
            }
        }
    }

    document.getElementById("edit-game").onclick = (event) => {
        loadModifiedGames(game.ID, () => loadDetailGame(game.ID));
    };

    document.getElementById("delete-game").onclick = (event) => {
        console.log("Cancellazione gioco:", game.ID);
    };
}