import { loadModifiedGames, loadDetailGame, loadAllGameList } from "../main.js";
import { getGameById, deleteGame }  from '../utilities/api.js';
import * as Notifier                from '../utilities/notifier.js';

const ID = {    Name: 'game-name',      Image: 'game-image',    Players: 'game-players-val',
                Time: 'game-time-val',  MinAge: 'game-age-val', Year: 'game-year-val',
                Description: 'game-description-text',           Location: 'game-location-val',
}

// note: if error occurs the caller handle it
export async function fillGameDetails(id) { await fillGameDetailWithGame(await getGameById(id)); }

async function fillGameDetailWithGame(game) {
    for (const key in ID) {
        const element = document.getElementById(ID[key]);
        
        if (!element) { console.warn(`Element with ID ${ID[key]} not found for key ${key}`); continue; }
        switch(key) {
            case 'Players': element.textContent = `${game.MinPlayer}-${game.MaxPlayer}`; break;
            case 'Image': element.src = game.UrlBigImage || './IMG/placeholder.jpg'; element.alt = game.Name; break;
            default: element.textContent =  game[key] || 'N/D'; break;
        }
    }

    document.getElementById("edit-game").onclick = () => { loadModifiedGames(game.ID, () => loadDetailGame(game.ID)); };

    document.getElementById("delete-game").onclick = () => {
        Notifier.askDeleteConfirmation(game.Name, async () => {
            try{
                await deleteGame(game.ID);
                Notifier.showDeleteSuccess(loadAllGameList);  
            }catch(e){
                console.error("Error deleting game:", e);
                Notifier.showSpecificApiError(e, Notifier.showDeleteError);         // I don't pass onOk parameters because it doesn't have to do anything
            }
        });
    };
}