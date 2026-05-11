import { loadAllGameList } from '../main.js';
import { getGameById } from '../utilities/api.js';
import { validateGame, cleanGameData, GAME_CONSTRAINTS } from '../sharedExports.js';

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

const IDMinimalConstraints = {
    MinPlayers: ['MinPlayer', 'MaxPlayer'],     MinTime: ['Time'],
    MinPlayerAge: ['MinAge'],                   MinYear: ['Year'],
}

const IDMaximalConstraints = {
    MaxYear: ['Year'],
}

// note: if error occurs the caller handle it
export async function fillGameForm(id) {
    const game = await getGameById(id);
    await fillGameFormWithGame(game);
}

async function fillGameFormWithGame(game) {
    console.log("Riempio il form con i dati del gioco:", game);
    for (const key in ID) {
        const element = document.getElementById(ID[key]);
        
        if (!element) { console.warn(`Elemento con ID ${ID[key]} non trovato per la chiave ${key}`); continue; }
        if (game[key] == undefined) { console.log("Chiave non presente nei dati del gioco:", key); continue; }

        element.value = game[key];
    }
}

function addSpecificProperties(proprietis, constraintsArray) {
    for (const key in constraintsArray) {
        for (const id of constraintsArray[key]) { 
            const element = document.getElementById(ID[id]);
            if (element) { element[proprietis] = GAME_CONSTRAINTS[key]; }
        }
    }
}

export async function setConstraintGameForm() {
    for (const key of GAME_CONSTRAINTS.RequireFields) {
        const element = document.getElementById(ID[key]);
        if (element) { element.required = true; }
    }

    addSpecificProperties('min', IDMinimalConstraints);
    addSpecificProperties('max', IDMaximalConstraints);
}

export async function gameSaveForm(event) {
    event.preventDefault(); 

    const form = event.target; 
    const method = event.target.dataset.method;
    const gameData = Object.fromEntries(new FormData(form));

    console.log("Operazione:", method);
    console.log("Dati estratti dal form:", gameData);
}