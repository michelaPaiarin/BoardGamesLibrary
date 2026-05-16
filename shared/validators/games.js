import { GAME_CONSTRAINTS } from '../config/gameConstraints.js';
import * as Validator from './common.js';
import * as Error from "./errors.js";

const validators = {
    'ID': validateID,                   'Name': validateName,     
    'MinAge': validatePlayerAge,        'Time': validateTime,
    'Location': validateLocation,       'Description': validateDescription,
    'MinPlayer': (value) => validatePlayer(value, 'MinPlayer'),
    'MaxPlayer': (value) => validatePlayer(value, 'MaxPlayer'),
    'UrlBigImage': (value) => validateImageUrl(value, 'UrlBigImage'),
    'UrlSmallImage': (value) => validateImageUrl(value, 'UrlSmallImage'),   
    'Year': validateYear
}

export function fieldsValidator(field){
    const validator = validators[field];
    if (validator) { return validator; }
    else { throw Error.ERROR_UNKNOWN_FIELDS; }
}

export function cleanGameData(game){
    return Validator.cleanData(game, GAME_CONSTRAINTS.Fields);
}

export function checkRequireFields(game, isUpdate){
    return Validator.checkRequireFields(game, (!isUpdate)
            ? GAME_CONSTRAINTS.RequireFields
            : Validator.arrayIntersection(GAME_CONSTRAINTS.RequireFields, Object.keys(game)));
}

export function validateID(id) {
    if (!id || isNaN(id) || parseInt(id) <= 0 || !Number.isInteger(Number(id))) {
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
    
    let errors = checkRequireFields(game, isUpdate).errors;
    
    validationResult = Validator.checkFieldsType(game, 'string', GAME_CONSTRAINTS.TextFields);
    if(!validationResult.valid){ errors = errors.concat(validationResult.errors);}
    validationResult = Validator.checkFieldsType(game, 'number', GAME_CONSTRAINTS.NumericFields);
    if(!validationResult.valid){ errors = errors.concat(validationResult.errors);}

    // Validate fields value if present, ignore unknown fields and skip validation for undefined or null optional fields
    for (const [field, value] of Object.entries(game)) {
        if (!GAME_CONSTRAINTS.Fields.includes(field))               { continue; }   // Ignore unknown fields
        else {
            if (game[field] === undefined || game[field] === null)  { continue; }   // Skip validation for undefined or null optional fields

            validationResult = fieldsValidator(field)(value);
            if (!validationResult.valid) { 
                if (validationResult.errors) { errors = errors.concat(validationResult.errors); }
                else                         { errors.push({ field: field, message: validationResult.message }); }
            }
        }
    }
    
    if (game.MinPlayer !== undefined && game.MaxPlayer !== undefined) {
        let playerValidation =  validatePlayerCount(game.MinPlayer, game.MaxPlayer);  
        if (!playerValidation.valid) { errors.push( { field: 'Player', message: playerValidation.message });}
    }

    return Validator.createValidateResult(errors);
}

function validateDescription(description)   { return Validator.validateText(description, 'Description'); }
function validateName(name)                 { return Validator.validateText(name, 'Name', false);        }

function validateImageUrl(imageUrl, field) { return Validator.validateUrl(imageUrl, field, GAME_CONSTRAINTS.ImageAcceptedProtocols);                    }
function validateLocation(location)        { return Validator.validateRegex(location, 'Location', GAME_CONSTRAINTS.LocationRegex);                      }

function validatePlayer(player, field)     { return Validator.validateNumberRange(player,  field,  GAME_CONSTRAINTS.MinPlayers);                        }
function validatePlayerAge(age)            { return Validator.validateNumberRange(age,     'Age',  GAME_CONSTRAINTS.MinPlayerAge);                      }
function validateTime(time)                { return Validator.validateNumberRange(time,    'Time', GAME_CONSTRAINTS.MinTime);                           }
function validateYear(year)                { return Validator.validateNumberRange(year,    'Year', GAME_CONSTRAINTS.MinYear, GAME_CONSTRAINTS.MaxYear); }

function validatePlayerCount(minPlayers, maxPlayers) {
    return (minPlayers > maxPlayers)
            ? { valid: false, message: 'Invalid player count. Minimum players cannot be greater than maximum players.' }
            : {valid: true};
}