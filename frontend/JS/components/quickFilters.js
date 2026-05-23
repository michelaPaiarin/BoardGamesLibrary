import { QUICK_FILTERS } from "../sharedExports.js";
import { updateFilters, FILTER_ACTION} from "../utilities/filterManager.js";

const QUICK_FILTERS_ID = 'quick-filter-grid';

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
            updateFilters(filter.query, (state === 'ACTIVATED') ? FILTER_ACTION.ADD : FILTER_ACTION.REMOVE)
        });
        
        quickFilterContainer.appendChild(button);
    }
}