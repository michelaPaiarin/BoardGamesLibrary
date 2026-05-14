import { getAllGames } from "../utilities/api.js";
import { loadModifiedGames, loadDetailGame, loadAllGameList } from "../main.js";

const GAME_CARD_PATH = './components/gameCard.html'

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

async function updateGamesDetails(gameList){
    const gameNameElement = document.getElementById('total-games');
    if (gameNameElement) { gameNameElement.textContent = gameList.length; }
}

export async function printAllGames(filter = {}) {
    if (Object.keys(filter).length > 0) {
        console.log("Hai chiesto i seguiti filtri " + JSON.stringify(filter));
        console.log("Ci pensiamo per ora eccoteli tutti");
    }

    const games = await getAllGames();
    console.log("Giochi ricevuti dal server:", games);
    updateGamesDetails(games);
    const container = document.getElementById('main-home');
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
