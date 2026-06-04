import * as Loader         from "./utilities/loader.js";
import * as Notifier       from "./utilities/notifier.js";
import * as PopUp          from "./components/popup.js";
import * as Router         from "./utilities/router.js";
import { ROUTES }          from "./utilities/router.js";       

import { printAllGames   } from "./views/gamesList.js";
import { fillGameDetails } from "./views/gameDetail.js";
import { gameSaveForm, fillGameForm, setConstraintGameForm } from "./views/gameForm.js";

const LOAD_VIEWS = {
    [ROUTES.HOME]:       async () => await loadAllGameList(),
    [ROUTES.ADD]:        async () => await loadAddGame(),
    [ROUTES.MODIFIED]:   async (id) => await loadModifiedGames(id),
    [ROUTES.DETAIL]:     async (id) => await loadDetailGame(id)
}

document.addEventListener('DOMContentLoaded', async () => {
    await Loader.init();        PopUp.init();   Router.initRouter(changeView);

    if (!history.state) { Router.navigateTo(ROUTES.HOME, null, true);                  }
    else                { changeView(history.state.viewsName, history.state.id); }
});

async function changeView(viewsName, id = null, pushToHistory = true) {
    let routeAction = LOAD_VIEWS[viewsName];
    if (routeAction) { await routeAction(id); }
    else { await LOAD_VIEWS[ROUTES.HOME](); }
}

export async function loadAddGame(){
    await Loader.loadMainAddGame();
    await setConstraintGameForm();

    let form = document.getElementById("game-form");
    form.dataset.method = "POST";
    form.onsubmit = (event) => gameSaveForm(event, () => Router.navigateTo(ROUTES.HOME));
    form.dataset.initialState = getFormStateString(form);

    const backBtn = document.getElementById('navigate-back-btn');
    if (backBtn) { backBtn.addEventListener('click', () => goBackForm(form)); }
};

function getFormStateString(form){ return new URLSearchParams(new FormData(form)).toString();}

function goBackForm(form){
    const currentState = getFormStateString(form);
    if(currentState !== form.dataset.initialState){ Notifier.askLeaveFormConfirmation(Router.goBack); }
    else                                          { Router.goBack();                                  }
}

export async function loadModifiedGames(id) {    
    await Loader.loadMainModifiedGames(); 
    try {
        await setConstraintGameForm(), await fillGameForm(id);

        let form = document.getElementById("game-form");
        form.dataset.method = "PUT";
        form.dataset.gameID = id;
        form.dataset.initialState = getFormStateString(form);
        form.onsubmit = (event) => gameSaveForm(event, Router.goBack);
        
        const backBtn = document.getElementById('navigate-back-btn');
        backBtn.addEventListener('click', () => goBackForm(form));
    } catch (error) {
        console.error("Error loading game details:", error);
        Notifier.showSpecificApiError(error, () => Notifier.showErrorGetGame(() => Router.navigateTo(ROUTES.HOME)));         // I don't pass onOk parameters because it doesn't have to do anything
    }
};

export async function loadDetailGame(id) {
    try {
        await Loader.loadMainDetailGame(); await fillGameDetails(id);
    
        const backBtn = document.getElementById('navigate-back-btn');
        if (backBtn) { backBtn.addEventListener('click', Router.goBack); }
    }catch (error) {
        console.error("Error loading game details:", error);
        Notifier.showLoadDetailError(Router.goBack);
    }    
};

export async function loadAllGameList() {
    await Loader.loadMainAllGames(); await printAllGames(() => Router.navigateTo(ROUTES.ADD));
    document.getElementById('add-game-btn').addEventListener('click', () => Router.navigateTo(ROUTES.ADD));
};
