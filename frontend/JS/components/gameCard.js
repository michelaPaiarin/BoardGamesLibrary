import { loadModifiedGames, loadDetailGame, loadAllGameList } from "../main.js";

const GAME_CARD_PATH = './components/gameCard.html';

const CARD_FIELDS  = [
    { selector: '.game-title',      prop: 'textContent',      value: g => g.Name },
    { selector: '.game-img',        prop: 'src',              value: g => g.UrlSmallImage || './IMG/placeholder.jpg' },
    { selector: '.game-img',        prop: 'alt',              value: g => g.Name },
    { selector: '.game-players',    prop: 'textContent',      value: g => `👥 ${g.MinPlayer}-${g.MaxPlayer}` },
    { selector: '.game-time',       prop: 'textContent',      value: g => `⏱️ ${g.Time} min` },
    { selector: '.game-age',        prop: 'textContent',      value: g => `👶 +${g.MinAge}` },
    { selector: '.game-location',   prop: 'textContent',      value: g => g.Location },
];

let template;

export async function init() {
    try {
        const responseHTML = await fetch(GAME_CARD_PATH);
        if (!responseHTML.ok) { throw new Error(`Errore nel caricamento del template: ${responseHTML.status}`);}
        
        const cardTemplate = await responseHTML.text();
        console.log("Template caricato con successo!"); 
        
        template = cardTemplate;
    } catch (error) {
        console.error("Errore nel caricamento del template:", error);
        throw new Error("Loading error");
    }
}

export function isTemplateLoad(){
    return (template) ? true : false;
}

export function createGameCard(game) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = template;

    CARD_FIELDS.forEach(({ selector, prop, value }) => { tempDiv.querySelector(selector)[prop] = value(game);});

    tempDiv.querySelector('.game-action-btn').dataset.gameId = game.ID;

    tempDiv.querySelector('.game-action-btn').onclick = (event) => {
        event.stopPropagation();
        loadModifiedGames(game.ID, loadAllGameList);
    };
    
    tempDiv.firstElementChild.onclick = () => {loadDetailGame(game.ID); };

    return tempDiv.firstElementChild;
}