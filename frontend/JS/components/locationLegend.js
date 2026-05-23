import { LOCATION_LEGEND } from "../sharedExports.js";

const LEGEND_ID = 'legend-grid';

export function renderLocationLegend() {
    const legendContainer = document.getElementById(LEGEND_ID);
    if (!legendContainer) { return; } 

    const html = Object.entries(LOCATION_LEGEND).map(([abbreviation, name]) => `
        <div class="legend-item">
            <span class="legend-badge">${abbreviation}</span>
            <span>${name}</span>
        </div>`
    ).join('');
    
    legendContainer.innerHTML = html;
}