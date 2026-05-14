import * as Loader         from "./utilities/loader.js";
import * as LoaderError    from "./utilities/loaderError.js";

import { printAllGames   } from "./views/gamesList.js";
import { fillGameDetails } from "./views/gameDetail.js";
import { gameSaveForm, fillGameForm, setConstraintGameForm } from "./views/gameForm.js";

document.addEventListener('DOMContentLoaded', async () => {
    console.log("Avvio dell'applicazione...");
    await loadAllGameList();
});

export const loadAddGame = async function() {
    console.log("Hai cliccato su Aggiungi Gioco");
    await Loader.loadMainAddGame();
    await setConstraintGameForm();

    const backBtn = document.getElementById('navigate-back-btn');
    if (backBtn) { backBtn.addEventListener('click', loadAllGameList); }

    let form = document.getElementById("game-form");
    form.dataset.method = "POST";
    form.onsubmit = (event) => gameSaveForm(event, loadAllGameList);
};

export const loadModifiedGames = async function(id, previusPage) {
    console.log("Hai cliccato sul gioco con ID = " + id);
    
    await Loader.loadMainModifiedGames(); 
    try {
        await setConstraintGameForm();
        await fillGameForm(id);
    
        const backBtn = document.getElementById('navigate-back-btn');
        if (backBtn) { backBtn.addEventListener('click', previusPage); }
    
        let form = document.getElementById("game-form");
        form.dataset.method = "PUT";
        form.dataset.gameID = id;
        form.onsubmit = (event) => gameSaveForm(event, previusPage);
    } catch (error) {
        console.error("Errore durante il caricamento dei dettagli del gioco:", error);
        LoaderError.showErrorGetGame(loadAllGameList);
    }
};

export const loadDetailGame = async function(id) {
    console.log("Hai cliccato sul gioco con ID = " + id);
    try {
        await Loader.loadMainDetailGame(id);
        await fillGameDetails(id);
    
        const backBtn = document.getElementById('navigate-back-btn');
        if (backBtn) { backBtn.addEventListener('click', loadAllGameList); }
    }catch (error) {
        console.error("Errore durante il caricamento dei dettagli del gioco:", error);
        LoaderError.showErrorGetGame(loadAllGameList);
    }    
};

export const loadAllGameList = async function() {
    console.log("Caricamento della lista di tutti i giochi...");
    await Loader.loadComponents();
    await printAllGames();

    document.querySelector('.addGameButton').addEventListener('click', () => loadAddGame(''));
};
