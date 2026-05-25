import { updateFiltersAndRefresh, FILTER_ACTION } from "../utilities/filterManager.js";

const SEARCH_INPUT_ID = 'search-game-input';
const SEARCH_BTN_ID   = 'search-btn';
const CLEAR_BTN_ID    = 'clear-filter-btn';

export function initSearchBar() {
    const input   = document.getElementById(SEARCH_INPUT_ID);
    const searchBtn = document.getElementById(SEARCH_BTN_ID);
    const clearBtn  = document.getElementById(CLEAR_BTN_ID);

    searchBtn.addEventListener('click', () => {
        const value = input.value.trim();
        if (!value) {  input.setCustomValidity('Inserisci un titolo da cercare'); input.reportValidity();  return; }
        input.setCustomValidity(''); // reset errore
        updateFiltersAndRefresh({ Name_c: value }, FILTER_ACTION.ADD);

    });

    clearBtn.addEventListener('click', () => {
        input.value = '';
        updateFiltersAndRefresh({ Name_c: null }, FILTER_ACTION.REMOVE);
    });
}

export function clearSeachBar(){
    const searchInput = document.getElementById(SEARCH_INPUT_ID); 
    if (searchInput) { searchInput.value = ''; }
}