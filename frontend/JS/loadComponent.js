const NAVBAR_PATH = './components/navbar.html';
const FOOTER_PATH = './components/footer.html';

const MAIN_ALL_GAMES_PATH = './components/mainAllGames.html';
const MAIN_FORM_GAMES_PATH = './components/mainFormGame.html';
const MAIN_DETAIL_GAME_PATH = './components/mainDetailGame.html';

const MAIN_ALL_GAMES_TITLE = 'Tutti i giochi';
const MAIN_ADD_GAME_TITLE = `Aggiungi nuovo gioco`;
const MAIN_MODIFIED_GAMES_TITLE = `Modifica gioco: `;
const MAIN_DETAIL_GAME_TITLE = `Dettagli gioco: `;

const MAIN_TITLE_ID = 'content-title';

const load = [{'path': NAVBAR_PATH, 'placeholderId': 'navbar-placeholder'},
              {'path': FOOTER_PATH, 'placeholderId': 'footer-placeholder'},
              {'path': MAIN_ALL_GAMES_PATH, 'placeholderId': 'main-placeholder'}];

export async function loadComponents() { for (const item of load) { await loadComponent(item.path, item.placeholderId); }}

export async function loadComponent(path, placeholderId) {
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`Errore nel caricamento di ${path}`);
        const html = await response.text();
        document.getElementById(placeholderId).innerHTML = html;
    } catch (error) {
        console.error(`Non sono riuscito a caricare ${path}:`, error);
    }
}

export async function loadMainAllGames(){
    const titleEl = document.getElementById(MAIN_TITLE_ID);
    
    if(titleEl) { titleEl.innerText = MAIN_ALL_GAMES_TITLE; }
    await loadComponent(MAIN_ALL_GAMES_PATH, 'main-placeholder');
}

export async function loadMainAddGame(gameName){
    const titleEl = document.getElementById(MAIN_TITLE_ID);
    
    if(titleEl) { titleEl.innerText = `${MAIN_ADD_GAME_TITLE} ${gameName}`; }
    else        { console.warn(`Non trovo l'ID ${MAIN_TITLE_ID} nell'HTML, ma carico la pagina lo stesso!`); }

    await loadComponent(MAIN_FORM_GAMES_PATH, 'main-placeholder');
}

export async function loadMainModifiedGames(gameName){
    const titleEl = document.getElementById(MAIN_TITLE_ID);
    
    if(titleEl) { titleEl.innerText = `${MAIN_MODIFIED_GAMES_TITLE} ${gameName}`; }
    else        { console.warn(`Non trovo l'ID ${MAIN_TITLE_ID} nell'HTML, ma carico la pagina lo stesso!`); }
    
    await loadComponent(MAIN_FORM_GAMES_PATH, 'main-placeholder');
}

export async function loadMainDetailGame(gameName){
    const titleEl = document.getElementById(MAIN_TITLE_ID);
    
    if(titleEl) { titleEl.innerText = `${MAIN_DETAIL_GAME_TITLE} ${gameName}`; }
    else        { console.warn(`Non trovo l'ID ${MAIN_TITLE_ID} nell'HTML, ma carico la pagina lo stesso!`); }
    
    await loadComponent(MAIN_DETAIL_GAME_PATH, 'main-placeholder');
}