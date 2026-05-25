import * as GAME_CARD_RENDER        from "../components/gameCard.js";
import * as LEGEND_RENDER           from "../components/locationLegend.js";
import * as STATISTICS_RENDER       from "../components/collectionStatistics.js";
import * as QUICK_FILTERS_RENDER    from "../components/quickFilters.js";
import * as SEARCH_BAR              from "../components/searchBar.js";
import * as FILTER_MANAGER          from "../utilities/filterManager.js";

import {  getAllGames  } from "../utilities/api.js";
import { loadComponent } from "../utilities/loader.js";
import {  loadAddGame  } from "../main.js"

const GAME_LIST_ID = 'main-home';
const GAME_LIST_CLASS_NAME = 'game-list-container';
const EMPTY_STATES = {
    library: {  path: './components/emptyLibrary.html', btnId: 'empty-add-game-btn',      action: loadAddGame       },
    search:  {  path: './components/emptySearch.html',  btnId: 'empty-clear-filter-btn',  action: resetAllFilters   }
};

async function getGamesList(filter) {
    try {
        return await getAllGames(filter);
    } catch (e) {
        console.error("Errore durante il recupero della lista giochi:", e);
        Notifier.showSpecificApiError(e, null);
        throw e;
    }
}

export async function printAllGames() {
    LEGEND_RENDER.renderLocationLegend();
    QUICK_FILTERS_RENDER.renderQuickFilterButton();
    SEARCH_BAR.initSearchBar();
    FILTER_MANAGER.init(loadGames);

    await loadGames(); 
}

async function loadGames(filter = {}) {
    const container = document.getElementById(GAME_LIST_ID);
    if (!container){console.error('Container not created'); return; } // Checking to be safe. It shouldn't happen.

    let games;

    try     { games = await getGamesList(filter); }
    catch   { 
        container.innerHTML = '<p class="text-red-500 text-center mt-4">Impossibile comunicare con il server. Ricarica la pagina.</p>';
        return;
    }
    
    console.log(filter != {});
    await renderGameList(games, container, (Object.keys(filter).length > 0 ));
    STATISTICS_RENDER.renderCollectionStatics(games);
}

async function renderGameList(gameList, container, isFiltered){
    if (!gameList || gameList.length === 0) {
        renderEmptyState(isFiltered); resetCollectionStatics(); return;
    }

    if(!GAME_CARD_RENDER.isTemplateLoad()){
        try     { await GAME_CARD_RENDER.init();  }
        catch   { return;                         } // Checking to be safe. It shouldn't happen.
                                                    // Template fetch failed, nothing to render.
    } 

    container.innerHTML = "";
    container.className = GAME_LIST_CLASS_NAME;
    gameList.forEach(game => { container.appendChild(GAME_CARD_RENDER.createGameCard(game)); }); 
}


async function renderEmptyState(isFiltered) {
    const config = isFiltered ? EMPTY_STATES.search : EMPTY_STATES.library;

    try           { await loadComponent(config.path, GAME_LIST_ID); } 
    catch (error) { // Checking to be safe. It shouldn't happen.
        console.error("Errore di rendering Empty State:", error);
        const container = document.getElementById(GAME_LIST_ID);
        if (container) { container.innerHTML = `<p class="text-text-danger">Errore nel caricamento dell'interfaccia.</p>`;}
        return;
    }

    const btn = document.getElementById(config.btnId);
    if (btn) { btn.addEventListener('click', config.action); }
}

export async function resetAllFilters() {
    console.log("Reset totale dei filtri in corso...");
    QUICK_FILTERS_RENDER.resetFilters();
    SEARCH_BAR.clearSeachBar
    await FILTER_MANAGER.resetFilters();
}