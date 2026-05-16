import { loadAllGameList                                } from '../main.js';
import { getGameById, postGame, putGame                 } from '../utilities/api.js';
import { validateGame, cleanGameData, GAME_CONSTRAINTS  } from '../sharedExports.js';

const errorSufix = '-error';

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
    await fillGameFormWithGame(await getGameById(id));
}

async function fillGameFormWithGame(game) {
    console.log("Riempio il form con i dati del gioco");
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

function clearErrorMessages() {
    for (const key in ID) {
        let attribute;

        if      (key == 'MinPlayer')  { attribute = 'Players'; }
        else if (key == 'MaxPlayer')  { continue;             }
        else                          { attribute = key;      }
        
        const errorElement = document.getElementById(attribute + errorSufix);
        if (errorElement) { errorElement.textContent = ''; }
    }

    for(const key in ID){ document.getElementById(ID[key]).classList.remove('invalid'); }
}

function showErrorMessage(field, message) {
    const errorElement = document.getElementById(field + errorSufix);
    if (errorElement) { errorElement.textContent = message; }

    if (field == 'Player') {
        document.getElementById(ID['MinPlayer']).classList.add('invalid');
        document.getElementById(ID['MaxPlayer']).classList.add('invalid');
    } else {
        console.log(field, ID[field]);
        document.getElementById(ID[field]).classList.add('invalid');
    }
}

function showValidationErrors(errors) {
    for (const error of errors) {
        console.log(`Errore di validazione per ${error.field}: ${error.message}`);
        showErrorMessage(error.field, error.message);
    }
}

export async function gameSaveForm(event, previusPage) {
    event.preventDefault(); 
    clearErrorMessages();

    const method = event.target.dataset.method;
    const gameID = event.target.dataset.gameID || null;
    let gameData = Object.fromEntries(new FormData(event.target));

    console.log("Operazione:", method);
    console.log("Dati estratti dal form:", gameData);
    
    // To be safe. The user shouldn't see it unless they hit F12 and change the HTML5 constraints.
    try {
        gameData = cleanGameData(gameData);
    } catch (error) {
        console.error("Errore durante la pulizia dei dati del gioco:", error);
        alert("Errore nei dati inseriti: " + error.message);
        return;
    }

    
    console.log("Dati puliti del form:", gameData);

    let validation;

    switch (method) {
        case 'POST' : validation = validateGame(gameData);              break;
        case 'PUT'  : validation = validateGame(gameData, true);        break;
        default     : console.error("Metodo non supportato:", method);  throw new Error("Metodo non supportato");
    }
    
    console.log("Risultato della validazione:", validation);

    if (validation.errors.length > 0) { showValidationErrors(validation.errors); return; }
    
    saveChange(gameData, method, previusPage, gameID);
}

async function saveChange(game, method, previusPage, id = null) {
    console.log((method == 'PUT') ? `Salvo gioco id: ${id}` : `Salvo nuovo gioco`);
    
    try {
        let response;
        switch (method) {
            case 'POST' : response = await postGame(game);      break;
            case 'PUT'  : response = await putGame(id, game);   break;
            default     : throw new Error("Metodo non supportato");
        }
        
        if(method == 'POST'){ console.log(`Id nuovo gioco: ${response.gameId}`); }

        alert("Operazione completata con successo! Puoi tornare alla pagina precedente.");
        previusPage();
    } catch (error) {
        console.error("Errore durante il salvataggio del gioco:", error);
        alert("Errore durante il salvataggio del gioco: " + error.message);
    }
}