const ID = {
    Name: 'game-name',
    Image: 'game-image',
    Players: 'game-players-val',
    Time: 'game-time-val',
    MinAge: 'game-age-val',
    Year: 'game-year-val',
    Description: 'game-description-text',
    Location: 'game-location',
}

export async function fillGameDetails(game) {
    console.log("Riempio i dettagli del gioco:", game);

    for (const key in ID) {
        const element = document.getElementById(ID[key]);
        
        if (!element) { console.warn(`Elemento con ID ${ID[key]} non trovato per la chiave ${key}`); continue; }
        else{
            switch(key) {
                case 'Players': element.textContent = `${game.MinPlayer}-${game.MaxPlayer}`; break;
                case 'Image': element.src = game.UrlBigImage || './IMG/placeholder.jpg'; element.alt = game.Name; break;
                default: element.textContent =  game[key] || 'N/D'; break;
            }
        }
    }
}