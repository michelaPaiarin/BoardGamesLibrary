import { cleanFilter, validateFilter } from "../sharedExports.js";

export const FILTER_ACTION = { ADD: "add", REMOVE: "remove" };

let activeFilters = {};
let onFiltersChange;

export function init(callback) {
    activeFilters = {};
    onFiltersChange = callback;
}

/**
 * @param {Object} newFilters - filters to add or remove (es: { Time_le: 30 })
 * @param {string} action - FILTER_ACTION.ADD o FILTER_ACTION.REMOVE
 */
export function updateFilters(newFilters, action) {
    switch (action) {
        case FILTER_ACTION.ADD:     activeFilters = { ...activeFilters, ...newFilters };            break;
        case FILTER_ACTION.REMOVE:  for (const key in newFilters) { delete activeFilters[key];}     break;
    }
}

export async function updateFiltersAndRefresh(newFilters, action){
    if (!onFiltersChange) { console.error('FilterManager not initialized'); return;  }
    updateFilters(newFilters, action);
    
    const cleaned = cleanFilter(activeFilters);
    const result  = validateFilter(cleaned);
    if (!result.valid) { console.error('Filter not valid:', result.errors); return;  }

    await onFiltersChange(cleaned);
}

export async function resetFilters(){
    if (!onFiltersChange) { console.error('FilterManager not initialized'); return;  }
    activeFilters = {};
    await onFiltersChange(activeFilters);
}