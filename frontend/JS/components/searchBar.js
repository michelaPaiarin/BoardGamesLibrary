import { updateFiltersAndRefresh, FILTER_ACTION } from "../utilities/filterManager.js";
import { showUpcomingFeatures } from "../utilities/notifier.js"

const SEARCH_INPUT_ID = 'search-game-input';
const BTN = {
    search:   { id: 'search-btn',          onclick: searchGame            },
    clear:    { id: 'clear-filter-btn',    onclick: clearSearchName       },
    advanced: { id: 'advanced-search-btn', onclick: showUpcomingFeatures  } 
};

export function initSearchBar() {
    Object.values(BTN).forEach(config => {
        const button = document.getElementById(config.id);
        if (!button) {console.warn(`${config.id} not found`); } // Checking to be safe. It shouldn't happen.
        button.addEventListener('click', config.onclick);
    });
}

function getInput(){ return document.getElementById(SEARCH_INPUT_ID)};

function searchGame() {
    const input = getInput();
    if (!input) { return; }             // Checking to be safe. It shouldn't happen.
    const value = input.value.trim();
    if (!value) {  input.setCustomValidity('Inserisci un titolo da cercare');  input.reportValidity(); return;  }
    
    input.setCustomValidity(''); 
    updateFiltersAndRefresh({ Name_c: value }, FILTER_ACTION.ADD);
}

function clearSearchName() {
    clearSeachBar();
    updateFiltersAndRefresh({ Name_c: null }, FILTER_ACTION.REMOVE);
}

export function clearSeachBar(){
    const input = getInput();
    if (!input) { return; }             // Checking to be safe. It shouldn't happen.
    input.value = '';
}