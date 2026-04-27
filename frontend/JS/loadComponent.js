const NAVBAR_PATH = './components/navbar.html';
const FOOTER_PATH = './components/footer.html';

const load = [{'path': NAVBAR_PATH, 'placeholderId': 'navbar-placeholder'},
              {'path': FOOTER_PATH, 'placeholderId': 'footer-placeholder'}];

async function loadComponents() {
    for (const item of load) {
        loadComponent(item.path, item.placeholderId);
    }
}

async function loadComponent(path, placeholderId) {
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`Errore nel caricamento di ${path}`);
        const html = await response.text();
        document.getElementById(placeholderId).innerHTML = html;
    } catch (error) {
        console.error(`Non sono riuscito a caricare ${path}:`, error);
    }
}

// Chiama la funzione quando la pagina si carica
document.addEventListener('DOMContentLoaded', loadComponents);