const ID = {
    Name: 'name-input',
    MinPlayer: 'min-players-input',
    MaxPlayer: 'max-players-input',
    Time: 'time-input',
    MinAge: 'age-input',
    Year: 'year-input',
    Location: 'location-input',
    UrlSmallImage: 'small-image-input',
    UrlBigImage: 'big-image-input',
    Description: 'description-input',
}

export function fillGameForm(game) {
    console.log("Riempio il form con i dati del gioco:", game);
    for (const key in ID) {
        const element = document.getElementById(ID[key]);
        
        if (!element) { console.warn(`Elemento con ID ${ID[key]} non trovato per la chiave ${key}`); continue; }
        if (game[key] == undefined) { console.log("Chiave non presente nei dati del gioco:", key); continue; }

        element.value = game[key];
    }
}

export function gameSaveForm(event) {
    event.preventDefault(); 

    const form = event.target; 
    const method = event.target.dataset.apiMethod;
    const gameData = Object.fromEntries(new FormData(form));

    console.log("Operazione:", method);
    console.log("Dati estratti dal form:", gameData);
}