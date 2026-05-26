import { QUICK_FILTERS, INCOMPATIBLE_QUICK_FILTER } from "../sharedExports.js";
import { updateFilters, updateFiltersAndRefresh, FILTER_ACTION} from "../utilities/filterManager.js";

const QUICK_FILTERS_ID = 'quick-filter-grid';
const ACTIVE_CLASSNAME = 'active'

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
        
        button.addEventListener('click', async () => {
            button.classList.toggle(ACTIVE_CLASSNAME);
            if(!button.classList.contains(ACTIVE_CLASSNAME)){ updateFiltersAndRefresh(filter.query, FILTER_ACTION.REMOVE); return;}
            deactivateIncompatibleBtn(filter.id)
            await updateFiltersAndRefresh(filter.query, FILTER_ACTION.ADD);
        });
        
        quickFilterContainer.appendChild(button);
    }
}

function deactivateIncompatibleBtn(filterID){
    const group = INCOMPATIBLE_QUICK_FILTER.find(g => g.includes(filterID));

    if (group) {
        group.filter(id => id !== filterID).forEach(id => {
            const other = document.getElementById(id);
            if (!other){return;}
            
            if(other.classList.contains(ACTIVE_CLASSNAME)){
                other.classList.remove(ACTIVE_CLASSNAME);
                const otherFilter = QUICK_FILTERS.find(f => f.id === id);
                updateFilters(otherFilter.query, FILTER_ACTION.REMOVE);
            }
        });
    }
}

export function resetFilters() {
    QUICK_FILTERS.forEach(filter => {
        document.getElementById(filter.id).classList.remove(ACTIVE_CLASSNAME);
    });
}