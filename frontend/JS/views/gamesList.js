import { getAllGames } from "../utilities/api.js";
import { loadModifiedGames, loadDetailGame, loadAllGameList } from "../main.js";
import { LOCATION_LEGEND, QUICK_FILTERS } from "../sharedExports.js";

const GAME_CARD_PATH = './components/gameCard.html'

const STATISTICS_ID = {
    totalGames: 'total-games',
    totalPlayTime: 'total-playtime',
    avgPlayers: 'avg-players-val',
    avgAge: 'avg-age-val',
    avgTime: 'avg-time-val'
}

const LEGEND_ID = 'legend-grid';
const QUICK_FILTERS_ID = 'quick-filter-grid';

async function getTemplate() {
    try {
        const responseHTML = await fetch(GAME_CARD_PATH);
        if (!responseHTML.ok) { throw new Error(`Errore nel caricamento del template: ${responseHTML.status}`);}
        
        const cardTemplate = await responseHTML.text();
        console.log("Template caricato con successo!"); 
        
        return cardTemplate;
    } catch (error) {
        console.error("Errore nel caricamento del template:", error);
    }
}

export async function printAllGames(filter = {}) {
    if (Object.keys(filter).length > 0) {
        console.log("Hai chiesto i seguiti filtri " + JSON.stringify(filter));
        console.log("Ci pensiamo per ora eccoteli tutti");
    }
    
    const container = document.getElementById('main-home');
    let games;

    try       { games = await getAllGames(); }
    catch (e) {
        console.error("Errore durante il recupero della lista giochi:", e);
        container.innerHTML = '<p class="text-red-500 text-center mt-4">Impossibile comunicare con il server. Ricarica la pagina.</p>';
        Notifier.showSpecificApiError(e, null);
        
        return;
    }

    console.log("Giochi ricevuti dal server:", games);
    updateGamesDetails(games);
    renderLocationLegend();
    renderQuickFilterButton();
    container.innerHTML = ''; 

    const cardTemplate = await getTemplate();

    if (!games || games.length === 0) {
        container.innerHTML = '<p class="text-gray-500">Nessun gioco trovato.</p>';
        return;
    }

    container.className = 'game-list-container';

    games.forEach(game => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = cardTemplate;

        tempDiv.querySelector('.game-title').textContent = game.Name;
        tempDiv.querySelector('.game-img').src = game.UrlSmallImage || './IMG/placeholder.jpg';
        tempDiv.querySelector('.game-img').alt = game.Name;
        tempDiv.querySelector('.game-players').textContent = `👥 ${game.MinPlayer}-${game.MaxPlayer}`;
        tempDiv.querySelector('.game-time').textContent = `⏱️ ${game.Time} min`;
        tempDiv.querySelector('.game-location').textContent = game.Location;
        tempDiv.querySelector('.game-action-btn').dataset.gameId = game.ID;
        
        tempDiv.querySelector('.game-action-btn').onclick = (event) => {
            event.stopPropagation();
            loadModifiedGames(game.ID, loadAllGameList);
        };

        tempDiv.firstElementChild.onclick = () => {loadDetailGame(game.ID); };
        container.appendChild(tempDiv.firstElementChild);
    }); 
}

async function updateGamesDetails(gameList){
    if(!gameList || gameList.length === 0){return;} //The values ​​are zero by default

    let span = document.getElementById(STATISTICS_ID.totalGames);
    if (span) { span.textContent = gameList.length; }

    span = document.getElementById(STATISTICS_ID.totalPlayTime);
    if (span) {
        const totalMinutes = gameList.reduce((sum, game) => sum + game.Time, 0);
        span.textContent = (totalMinutes / 60).toFixed(1);
    }

    span = document.getElementById(STATISTICS_ID.avgPlayers);
    if (span) { 
        const avgMin = getAvg(gameList, 'MinPlayer'); const avgMax = getAvg(gameList, 'MaxPlayer');
        if (avgMin === avgMax)  { span.textContent = `${avgMin}`; }
        else                    { span.textContent = `${avgMin}-${avgMax}`; }
    }
    
    span = document.getElementById(STATISTICS_ID.avgAge);
    if (span) { span.textContent = `${getAvg(gameList, 'MinAge')}`; }

    span = document.getElementById(STATISTICS_ID.avgTime);
    if (span) { span.textContent = `${getAvg(gameList, 'Time')}`;}
}

function getAvg(gameList, key){
    const total = gameList.reduce((acc, game) => acc + (Number(game[key]) || 0), 0);
    return Math.round(total / gameList.length);
}

export function renderLocationLegend() {
    const legendContainer = document.getElementById(LEGEND_ID);
    if (!legendContainer) { return; } 

    legendContainer.innerHTML = '';

    for (const [abbreviation, name] of Object.entries(LOCATION_LEGEND)) {
        legendContainer.innerHTML += `<div class="legend-item">
            <span class="legend-badge">${abbreviation}</span>
            <span>${name}</span></div>`;
    }
}

export function renderQuickFilterButton() {
    const quickFilterContainer = document.getElementById(QUICK_FILTERS_ID);
    if (!quickFilterContainer) { return; }

    quickFilterContainer.innerHTML = ''; 
    
    for (const filter of QUICK_FILTERS) {
        const button = document.createElement('button');
        
        button.className = 'quick-filter-btn';
        button.id = filter.id;
        button.title = filter.tooltip;
        button.textContent = filter.label;
        
        button.addEventListener('click', () => {
            button.classList.toggle('active');
            const state = (button.classList.contains('active')) ? 'ACTIVATED' : 'DEACTIVATED';

            if(state === 'ACTIVATED'){ console.log(`Hai attivato il filtro ${filter.id}`); }
            else{ console.log(`Hai disattivato il filtro ${filter.id}`); }
        });
        
        quickFilterContainer.appendChild(button);
    }
}