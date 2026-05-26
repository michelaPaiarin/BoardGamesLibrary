const PATHS = {
    navbar:   './components/navbar.html',       footer:  './components/footer.html',
    popup:    './components/popup.html',        formGame:    './views/mainFormGame.html',
    allGames: './views/mainAllGames.html',      detailGame:  './views/mainDetailGame.html',
}

const TITLES = {
    allGames:   'Tutti i giochi',               addGame:    'Aggiungi nuovo gioco',
    editGame:   'Modifica gioco ',              detailGame: 'Dettagli gioco ',
}

const MAIN_TITLE_ID = 'content-title';

const loadOnce = [{'path': PATHS.navbar, 'placeholderId': 'navbar-placeholder'},
                  {'path': PATHS.footer, 'placeholderId': 'footer-placeholder'},
                  {'path': PATHS.popup,  'placeholderId': 'popup-placeholder'}];

export async function init() { for (const item of loadOnce) { await loadComponent(item.path, item.placeholderId); }}

export async function loadComponent(path, placeholderId) {
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`Error loading component ${path}`);
        const html = await response.text();
        document.getElementById(placeholderId).innerHTML = html;
    } catch (error) {
        console.error(`Error loading component ${path}:`, error);
        throw error;
    }
}

function setTitle(title) {
    const titleEl = document.getElementById(MAIN_TITLE_ID);
    if (titleEl) { titleEl.innerText = title; }
    else        { console.warn(`Element with ID ${MAIN_TITLE_ID} not found in HTML, but loading page anyway!`); }
}

export async function loadMainAllGames(){
    setTitle(TITLES.allGames); await loadComponent(PATHS.allGames, 'main-placeholder');
}

export async function loadMainAddGame(){
    setTitle(TITLES.addGame); await loadComponent(PATHS.formGame, 'main-placeholder');
}

export async function loadMainModifiedGames(){
    setTitle(TITLES.editGame); await loadComponent(PATHS.formGame, 'main-placeholder');
}

export async function loadMainDetailGame(){
    setTitle(TITLES.detailGame); await loadComponent(PATHS.detailGame, 'main-placeholder');
}