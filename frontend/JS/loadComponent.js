const NAVBAR_PATH = './components/navbar.html';

async function loadNavbar() {
    try {
        const response = await fetch(NAVBAR_PATH);
        if (!response.ok) throw new Error('Errore nel caricamento della navbar');
        const html = await response.text();
        document.getElementById('navbar-placeholder').innerHTML = html;
    } catch (error) {
        console.error("Non sono riuscito a caricare la navbar:", error);
    }
}

// Chiama la funzione quando la pagina si carica
document.addEventListener('DOMContentLoaded', loadNavbar);