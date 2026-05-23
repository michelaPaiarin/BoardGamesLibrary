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
export async function updateFilters(newFilters, action) {
    switch (action) {
        case FILTER_ACTION.ADD:     activeFilters = { ...activeFilters, ...newFilters };            break;
        case FILTER_ACTION.REMOVE:  for (const key in newFilters) { delete activeFilters[key];}     break;
    }

    console.log('Filtri attuali:', activeFilters);
    await onFiltersChange(activeFilters);
}