import * as Loader         from "./utilities/loader.js";
import * as LoaderError    from "./utilities/loaderError.js";
import * as PopUp          from "./utilities/popup.js";             

import { printAllGames   } from "./views/gamesList.js";
import { fillGameDetails } from "./views/gameDetail.js";
import { gameSaveForm, fillGameForm, setConstraintGameForm } from "./views/gameForm.js";

document.addEventListener('DOMContentLoaded', async () => {
    console.log("Avvio dell'applicazione...");
    await Loader.init();
    PopUp.init();
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

function getFormStateString(form){
    return new URLSearchParams(new FormData(form)).toString()
}

export const loadModifiedGames = async function(id, previusPage) {
    console.log("Hai cliccato sul gioco con ID = " + id);
    
    await Loader.loadMainModifiedGames(); 
    try {
        await setConstraintGameForm(), await fillGameForm(id);

        let form = document.getElementById("game-form");
        form.dataset.method = "PUT";
        form.dataset.gameID = id;
        form.dataset.initialState = getFormStateString(form);
        form.onsubmit = (event) => gameSaveForm(event, previusPage);
        
        const backBtn = document.getElementById('navigate-back-btn');
        backBtn.addEventListener('click', () => {
            const currentState = getFormStateString(form);
            if(currentState !== form.dataset.initialState){
                if(confirm("Se torni indietro le modifiche andranno perse. Sei sicuro?")){ previusPage(); }
            }else{ previusPage(); }
        });
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
    await Loader.loadMainAllGames();
    await printAllGames();

    document.querySelector('.addGameButton').addEventListener('click', () => loadAddGame(''));
};
