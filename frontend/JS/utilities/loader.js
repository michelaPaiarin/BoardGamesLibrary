const PATHS = {
    navbar:  './components/navbar.html',        footer:  './components/footer.html',
    popup:   './components/pop-up.html',        formGame:    './views/mainFormGame.html',
    allGames:    './views/mainAllGames.html',   detailGame:  './views/mainDetailGame.html',
}

const TITLES = {
    allGames:   'Tutti i giochi',               addGame:    'Aggiungi nuovo gioco',
    editGame:   'Modifica gioco: ',             detailGame: 'Dettagli gioco: ',
}

const MAIN_TITLE_ID = 'content-title';

const loadOnce = [{'path': PATHS.navbar, 'placeholderId': 'navbar-placeholder'},
                  {'path': PATHS.footer, 'placeholderId': 'footer-placeholder'},
                  {'path': PATHS.popup, 'placeholderId': 'popup-placeholder'}];

export async function init() { for (const item of loadOnce) { await loadComponent(item.path, item.placeholderId); }}

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
    
    if(titleEl) { titleEl.innerText = TITLES.allGames; }
    await loadComponent(PATHS.allGames, 'main-placeholder');
}

export async function loadMainAddGame(gameName){
    const titleEl = document.getElementById(MAIN_TITLE_ID);
    
    if(titleEl) { titleEl.innerText = `${TITLES.addGame} ${gameName}`; }
    else        { console.warn(`Non trovo l'ID ${MAIN_TITLE_ID} nell'HTML, ma carico la pagina lo stesso!`); }

    await loadComponent(PATHS.formGame, 'main-placeholder');
}

export async function loadMainModifiedGames(gameName){
    const titleEl = document.getElementById(MAIN_TITLE_ID);
    
    if(titleEl) { titleEl.innerText = `${TITLES.editGame} ${gameName}`; }
    else        { console.warn(`Non trovo l'ID ${MAIN_TITLE_ID} nell'HTML, ma carico la pagina lo stesso!`); }
    
    await loadComponent(PATHS.formGame, 'main-placeholder');
}

export async function loadMainDetailGame(gameName){
    const titleEl = document.getElementById(MAIN_TITLE_ID);
    
    if(titleEl) { titleEl.innerText = `${MAIN_DETAIL_GAME_TITLE} ${gameName}`; }
    else        { console.warn(`Non trovo l'ID ${MAIN_TITLE_ID} nell'HTML, ma carico la pagina lo stesso!`); }
    
    await loadComponent(PATHS.detailGame, 'main-placeholder');
}