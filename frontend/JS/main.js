import * as Loader         from "./utilities/loader.js";
import * as Notifier       from "./utilities/notifier.js";
import * as PopUp          from "./components/popup.js";             

import { printAllGames   } from "./views/gamesList.js";
import { fillGameDetails } from "./views/gameDetail.js";
import { gameSaveForm, fillGameForm, setConstraintGameForm } from "./views/gameForm.js";

document.addEventListener('DOMContentLoaded', async () => {
    await Loader.init();
    PopUp.init();
    await loadAllGameList();
});

export async function loadAddGame(){
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

export async function loadModifiedGames(id, previousPage) {    
    await Loader.loadMainModifiedGames(); 
    try {
        await setConstraintGameForm(), await fillGameForm(id);

        let form = document.getElementById("game-form");
        form.dataset.method = "PUT";
        form.dataset.gameID = id;
        form.dataset.initialState = getFormStateString(form);
        form.onsubmit = (event) => gameSaveForm(event, previousPage);
        
        const backBtn = document.getElementById('navigate-back-btn');
        backBtn.addEventListener('click', () => {
            const currentState = getFormStateString(form);
            if(currentState !== form.dataset.initialState){
                Notifier.askLeaveFormConfirmation(previousPage);
            }else{ previousPage(); }
        });
    } catch (error) {
        console.error("Errore durante il caricamento dei dettagli del gioco:", error);
        Notifier.showSpecificApiError(error, () => Notifier.showErrorGetGame(loadAllGameList));
    }
};

export async function loadDetailGame(id) {
    try {
        await Loader.loadMainDetailGame(); await fillGameDetails(id);
    
        const backBtn = document.getElementById('navigate-back-btn');
        if (backBtn) { backBtn.addEventListener('click', loadAllGameList); }
    }catch (error) {
        console.error("Errore durante il caricamento dei dettagli del gioco:", error);
        Notifier.showLoadDetailError(loadAllGameList);
    }    
};

export async function loadAllGameList() {
    await Loader.loadMainAllGames(); await printAllGames(loadAddGame);
    document.getElementById('add-game-btn').addEventListener('click', () => loadAddGame(''));
};
