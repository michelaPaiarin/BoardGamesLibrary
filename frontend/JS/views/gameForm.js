import { getGameById, postGame, putGame                 } from '../utilities/api.js';
import { validateGame, cleanGameData, GAME_CONSTRAINTS  } from '../sharedExports.js';
import * as Notifier                                      from '../utilities/notifier.js';

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
    MinPlayer: ['MinPlayer', 'MaxPlayer'],      MinTime: ['Time'],
    MinAge:    ['MinAge'],                      MinYear: ['Year'],
}

const IDMaximalConstraints = { MaxYear: ['Year'] }

// note: if error occurs the caller handle it
export async function fillGameForm(id) {
    await fillGameFormWithGame(await getGameById(id));
}

async function fillGameFormWithGame(game) {
    for (const key in ID) {
        const element = document.getElementById(ID[key]);
        
        if (!element) { console.warn(`Element with ID ${ID[key]} not found for key ${key}`); continue; }
        if (game[key] == undefined) { continue; }

        element.value = game[key];
    }
}

function addSpecificProperties(property, constraintsArray) {
    for (const key in constraintsArray) {
        for (const id of constraintsArray[key]) { 
            const element = document.getElementById(ID[id]);
            if (element) { element[property] = GAME_CONSTRAINTS[key]; }
        }
    }
}

export async function setConstraintGameForm() {
    for (const key of GAME_CONSTRAINTS.RequiredFields) {
        const element = document.getElementById(ID[key]);
        if (element) { element.required = true; }
    }

    addSpecificProperties('min', IDMinimalConstraints);
    addSpecificProperties('max', IDMaximalConstraints);

    for (const key in ID) {
        const el = document.getElementById(ID[key]);
        if (el) { el.addEventListener('input', () => el.setCustomValidity('')); }
    }
}

function clearValidationErrors() {
    for (const key in ID) {
        const el = document.getElementById(ID[key]);
        if (el) { el.setCustomValidity(''); }
    }
}

/* Custom validation errors are shown one at a time via setCustomValidity/reportValidity.
 * There are at most 4 semantic checks not handle natively with HTML5
 * It's rare for there to be more than one.
 * Since there are so few of them, I think it's acceptable to show them one at a time.
*/
function showErrorMessage(field, message) {
    const fieldId = (field === 'Player') ? ID['MinPlayer'] : ID[field];
    const el = document.getElementById(fieldId);
    if (el) { el.setCustomValidity(message); el.reportValidity(); }
}

function showValidationErrors(errors) {
    errors.forEach(error => { showErrorMessage(error.field, error.message);});
}

export async function gameSaveForm(event, previousPage) {
    event.preventDefault(); 
    clearValidationErrors();

    const method = event.target.dataset.method;
    const gameID = event.target.dataset.gameID || null;
    let gameData = Object.fromEntries(new FormData(event.target));
    
    // To be safe. The user shouldn't see it unless they hit F12 and change the HTML5 constraints.
    try { gameData = cleanGameData(gameData); }
    catch (error) {
        console.error("Error cleaning game data:", error);
        Notifier.showDataError(); return;
    }

    let validation;

    switch (method) {
        case 'POST' : validation = validateGame(gameData);              break;
        case 'PUT'  : validation = validateGame(gameData, true);        break;
        default     : console.error("Unsupported method:", method);  throw new Error("Unsupported method");
    }

    if (validation.errors.length > 0) { showValidationErrors(validation.errors); return; }
    
    saveChange(gameData, method, previousPage, gameID);
}

async function saveChange(game, method, previousPage, id = null) {    
    try {
        switch (method) {
            case 'POST' : await postGame(game);          Notifier.showCreateSuccess(previousPage);  return;
            case 'PUT'  : await putGame(id, game);       Notifier.showModifySuccess(previousPage);  return;
            default     : throw new Error("Unsupported method");
        }
    } catch (e) {
        switch (method) { // I don't pass onOk parameters because it doesn't have to do anything
            case 'POST' : Notifier.showSpecificApiError(e, Notifier.showCreateError);  return;
            case 'PUT'  : Notifier.showSpecificApiError(e, Notifier.showModifyError);  return;
        }
    }
}