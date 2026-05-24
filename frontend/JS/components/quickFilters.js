import { QUICK_FILTERS, INCOMPATIBLE_QUICK_FILTER } from "../sharedExports.js";
import { updateFilters, updateFiltersAndRefresh, FILTER_ACTION} from "../utilities/filterManager.js";

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
        
        button.addEventListener('click', async () => {
            button.classList.toggle('active');
            const isActive = button.classList.contains('active');
            
            if(!isActive){ updateFilters(filter.query, FILTER_ACTION.REMOVE); return;}

            const group = INCOMPATIBLE_QUICK_FILTER.find(g => g.includes(filter.id));

            if (group && isActive) {
                group.filter(id => id !== filter.id).forEach(id => {
                    const other = document.getElementById(id);
                    if (!other){return;}
                    
                    if( other.classList.contains('active')){
                        other.classList.remove('active');
                        const otherFilter = QUICK_FILTERS.find(f => f.id === id);
                        updateFilters(otherFilter.query, FILTER_ACTION.REMOVE);
                    }
                });
            }
        
            await updateFiltersAndRefresh(filter.query, isActive ? FILTER_ACTION.ADD : FILTER_ACTION.REMOVE);
        });
        
        quickFilterContainer.appendChild(button);
    }
}