import * as Loader         from "./utilities/loader.js";
import * as Notifier       from "./utilities/notifier.js";
import * as PopUp          from "./components/popup.js";             

import { printAllGames   } from "./views/gamesList.js";
import { fillGameDetails } from "./views/gameDetail.js";
import { gameSaveForm, fillGameForm, setConstraintGameForm } from "./views/gameForm.js";

document.addEventListener('DOMContentLoaded', async () => {
    console.log("Avvio dell'applicazione...");
    await Loader.init();
    PopUp.init();
    await loadAllGameList();
});

export async function loadAddGame(){
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

export async function loadModifiedGames(id, previusPage) {
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
                Notifier.askLeaveFormConfirmation(previusPage, () => {
                    console.log("L'utente ha deciso di restare nel form");
                });
            }else{ previusPage(); }
        });
    } catch (error) {
        console.error("Errore durante il caricamento dei dettagli del gioco:", error);
        Notifier.showSpecificApiError(error, () => Notifier.showErrorGetGame(loadAllGameList));
    }
};

export async function loadDetailGame(id) {
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

export async function loadAllGameList() {
    console.log("Caricamento della lista di tutti i giochi...");
    await Loader.loadMainAllGames();
    await printAllGames();
    document.getElementById('add-game-btn').addEventListener('click', () => loadAddGame(''));
};
