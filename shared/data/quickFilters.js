export const QUICK_FILTERS = [
    { 
        id: 'filter-fast', 
        label: '⏱️ Veloce', 
        tooltip: '≤ 30 minuti',
        query: { Time_le: 30 } 
    }, { 
        id: 'filter-long', 
        label: '🌙 Seratona', 
        tooltip: '≥ 90 min',
        query: { Time_ge: 90 } 
    }, { 
        id: 'filter-3p', 
        label: '👥 Famiglia', 
        tooltip: '3 giocatori',
        query: { Player_eq: 3 } 
    }, { 
        id: 'filter-party', 
        label: '🎉 Party', 
        tooltip: '6+ Giocatori',
        query: { MaxPlayer_ge: 6 } 
    }, { 
        id: 'filter-solo', 
        label: '👤 Solitario',
        tooltip: '1 giocatore',
        query: { Player_eq: 1 } 
    }, { 
        id: 'filter-kids', 
        label: '🧸 Bimbi', 
        tooltip: '≤ 8 anni',
        query: { MinAge_le: 8 } 
    }
];

export const INCOMPATIBLE_QUICK_FILTER = [
    ['filter-fast', 'filter-long'],
    ['filter-solo', 'filter-3p', 'filter-party'],
];