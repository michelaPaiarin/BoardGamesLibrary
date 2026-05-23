import * as GAME_CARD_RENDER        from "../components/gameCard.js";
import * as LEGEND_RENDER           from "../components/locationLegend.js";
import * as STATISTICS_RENDER       from "../components/collectionStatistics.js";
import * as QUICK_FILTERS_RENDER    from "../components/quickFilters.js";

import { getAllGames } from "../utilities/api.js";

const GAME_LIST_ID = 'main-home';
const GAME_LIST_CLASS_NAME = 'game-list-container';

async function getGamesList(filter) {
    try {
        if (Object.keys(filter).length > 0) {
            console.log("Hai chiesto i seguiti filtri " + JSON.stringify(filter));
            console.log("Ci pensiamo per ora eccoteli tutti");
            //TODO: chima builder per filtri e fa la chiamata API con quelli
            return await getAllGames();
        }
        return await getAllGames();
    } catch (e) {
        console.error("Errore durante il recupero della lista giochi:", e);
        Notifier.showSpecificApiError(e, null);
        throw e;
    }
}

export async function printAllGames(filter = {}) {
    const container = document.getElementById(GAME_LIST_ID);
    if (!container){console.error('Container not created'); return; } // Checking to be safe. It shouldn't happen.

    let games;

    try     { games = await getGamesList(filter); }
    catch   { 
        container.innerHTML = '<p class="text-red-500 text-center mt-4">Impossibile comunicare con il server. Ricarica la pagina.</p>';
        return;
    }
    
    await renderGameList(games, container);

    // Fill the sidebar with data and dynamic elements
    LEGEND_RENDER.renderLocationLegend();
    STATISTICS_RENDER.renderCollectionStatics(games);
    QUICK_FILTERS_RENDER.renderQuickFilterButton();
}

async function renderGameList(gameList, container){
    if (!gameList || gameList.length === 0) {
        container.innerHTML = '<p class="text-gray-500">Nessun gioco trovato.</p>'; return;
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