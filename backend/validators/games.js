import { GAME_CONSTRAINTS } from '../config/gameConstraints.js';

const ERROR_UNKNOWN_FIELDS = new Error("Unknown fields");
const ERROR_INVALID_DATA_TYPE = new Error("Invalid data type. Only strings, numbers, or null are allowed.");

const validators = {
    'ID': validateID,                   'Name': validateName,
    'UrlBigImage': validateImageUrl,    'UrlSmallImage': validateImageUrl,
    'MinPlayer': validatePlayer,        'MaxPlayer': validatePlayer,
    'MinAge': validatePlayerAge,        'Time': validateTime,
    'Location': validateLocation,       'Description': validateDescription,
    'Year': validateYear
}

export function fieldsValidator(field){
    const validator = validators[field];
    if (validator) { return validator; }
    else { throw ERROR_UNKNOWN_FIELDS; }
}

export function cleanGameData(game){
    let newGame = {}
    for(const [field, value] of Object.entries(game)){
        if (!GAME_CONSTRAINTS.Fields.includes(field)) { continue; }

        if(typeof value === 'string'){
            const trimmedString = value.trim();
            newGame[field] = (trimmedString === '') ? null : trimmedString;
        }else if(typeof value === 'number' || value === null){
            newGame[field] = value;
        }else{
            throw ERROR_INVALID_DATA_TYPE;
        }
    }
    return newGame;
}

function checkValueRequire(fieldName, value){
    return (value === null) 
            ? { valid: false, message: `Field '${fieldName}' can't be null.` }
            : { valid: true};
}

export function checkRequireFields(game, isUpdate){
    for (const field of GAME_CONSTRAINTS.RequireFields) {
        const value = game[field];
        if(value === undefined && !isUpdate){
            return { valid: false, message: `Field '${field}' is required.` };
        }else {
            const check = checkValueRequire(field, game[field]);
            if (!check.valid){ return check; }
        }
    }
    return {valid: true};
}


export function validateID(id) {
    if (!id || isNaN(id) || parseInt(id) <= 0) {
        return { valid: false, message: 'Invalid ID. ID must be a positive integer.' };
    }
    return { valid: true };
}

function validateObjectGame(game) {
    if (!game || typeof game !== 'object') {
        return { valid: false, message: 'Invalid game data. Game must be an object.' };
    }
    return { valid: true };
}

export function validateGame(game, isUpdate = false) {
    let validationResult = validateObjectGame(game);
    if (!validationResult.valid) { return validationResult; }

    validationResult = checkRequireFields(game, isUpdate);                                           
    if (!validationResult.valid) { return validationResult;  }

    for (const [field, value] of Object.entries(game)) {
        if (!GAME_CONSTRAINTS.Fields.includes(field))               { continue; }   // Ignore unknown fields
        else {
            if (game[field] === undefined || game[field] === null)  { continue; }   // Skip validation for undefined or null optional fields

            validationResult = fieldsValidator(field)(value);
            if (!validationResult.valid) { return validationResult; }
        }
    }
    
    if (!isUpdate) { return validatePlayerCount(game.MinPlayer, game.MaxPlayer)}    // If it's a new game, last checks
    return { valid: true };
}

function validateName(name) {
    return (typeof name !== 'string')
            ? { valid: false, message: 'Invalid game name. Name must be a string.' }
            : { valid: true };
}

function validateImageUrl(imageUrl){
    if (typeof imageUrl !== 'string') { return { valid: false, message: 'Invalid image URL. Image URL must be a string.' }; }

    try {
        if (GAME_CONSTRAINTS.ImageAcceptedProtocols.indexOf((new URL(imageUrl)).protocol) === -1) {
            return { valid: false, message: 'Invalid image URL. Image URL must start with ' + GAME_CONSTRAINTS.ImageAcceptedProtocols.join(' or ') };
        }
    } catch (error) { return { valid: false, message: 'Invalid image URL. Image URL must be a valid URL.' }; }
    
    return { valid: true };
}

function validatePlayer(player){
    if (isNaN(player)){                                         return { valid: false, message: 'Invalid player count. Player count must be a number.' };}
    else if(parseInt(player) < GAME_CONSTRAINTS.MinPlayers) {   return { valid: false, message: 'Invalid player count. Player count must be greater than or equal to ' + GAME_CONSTRAINTS.MinPlayers };}
    return { valid: true };
}

function validatePlayerAge(age){
    if(isNaN(age)){                                             return { valid: false, message: 'Invalid min age. Age must be a number.' };}
    else if(parseInt(age) < GAME_CONSTRAINTS.MinPlayerAge){     return { valid: false, message: 'Invalid min age. Min age must be greater than or equal to ' + GAME_CONSTRAINTS.MinPlayerAge };}
    return { valid: true }
}

function validateTime(time){
    if (isNaN(time)){                                           return { valid: false, message: 'Invalid time. Time must be a number.' };}
    else if(parseInt(time) < GAME_CONSTRAINTS.MinTime) {        return { valid: false, message: 'Invalid time. Time must be greater than or equal to ' + GAME_CONSTRAINTS.MinTime };}
    return { valid: true };
}

function validateLocation(location){
    if (typeof location !== 'string') {                         return { valid: false, message: 'Invalid location. Location must be a string.' };}
    else if (!GAME_CONSTRAINTS.LocationRegex.test(location)) {  return { valid: false, message: 'Invalid location. Location must match the required format.' };}
    return { valid: true };
}

function validateDescription(description){
    return (typeof description !== 'string')
            ? { valid: false, message: 'Invalid description. Description must be a string.' }
            : { valid: true };
}

function validateYear(year){
    if (isNaN(year)){
       return { valid: false, message: 'Invalid year. Year must be a number.' };
    }else if(parseInt(year) < GAME_CONSTRAINTS.MinYear || parseInt(year) > GAME_CONSTRAINTS.MaxYear) {
        return { valid: false, message: `Invalid year. Year must be between ${GAME_CONSTRAINTS.MinYear} and ${GAME_CONSTRAINTS.MaxYear}.` };
    }

    return { valid: true };
}

function validatePlayerCount(minPlayers, maxPlayers) {
    return (minPlayers > maxPlayers)
            ? { valid: false, message: 'Invalid player count. Minimum players cannot be greater than maximum players.' }
            : {valid: true};
}