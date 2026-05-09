import { loadComponents, loadMainAddGame, loadMainModifiedGames, loadMainDetailGame} from "./loadComponent.js";
import { printAllGames   } from "./gamesUI.js";
import { gameSaveForm    } from "./components/gameForm.js";
import { fillGameDetails } from "./components/gameDetail.js";

document.addEventListener('DOMContentLoaded', async () => {
    console.log("Avvio dell'applicazione...");
    await loadAllGameList();
});

export const loadAddGame = async function() {
    console.log("Hai cliccato su Aggiungi Gioco");
    await loadMainAddGame();

    const backBtn = document.getElementById('navigate-back-btn');
    if (backBtn) { backBtn.addEventListener('click', loadAllGameList); }

    let form = document.getElementById("game-form");
    form.dataset.method = "POST";
    form.onsubmit = (event) => gameSaveForm(event);
};

export const loadModifiedGames = async function(game) {
    console.log("Hai cliccato su " + game.Name);
    await loadMainModifiedGames(game.Name); 
    
    const backBtn = document.getElementById('navigate-back-btn');
    if (backBtn) { backBtn.addEventListener('click', loadAllGameList); }
    
    let form = document.getElementById("game-form");
    form.dataset.method = "PUT";
    form.onsubmit = (event) => gameSaveForm(event);
};

export const loadDetailGame = async function(game) {
    console.log("Hai cliccato su " + game.Name);
    await loadMainDetailGame(game.Name);

    await fillGameDetails(game);
    
    const backBtn = document.getElementById('navigate-back-btn');
    if (backBtn) { backBtn.addEventListener('click', loadAllGameList); }
};

export const loadAllGameList = async function() {
    console.log("Caricamento della lista di tutti i giochi...");
    await loadComponents();
    await printAllGames();

    document.querySelector('.addGameButton').addEventListener('click', () => loadAddGame(''));
};
