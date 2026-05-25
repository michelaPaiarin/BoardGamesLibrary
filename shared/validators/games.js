import { GAME_CONSTRAINTS as GC} from '../config/gameConstraints.js';
import * as Validator from './common.js';
const { VALIDATION_ERRORS } = Validator;

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
    else { throw VALIDATION_ERRORS.UNKNOWN_FIELDS; }
}

export function cleanGameData(game){
    return Validator.cleanData(game, GC.Fields);
}

export function checkRequiredFields(game, isUpdate){
    return Validator.checkRequiredFields(game, (!isUpdate)
            ? GC.RequiredFields
            : Validator.arrayIntersection(GC.RequiredFields, Object.keys(game)));
}

export function validateID(id) {
    if (!id || isNaN(id) || parseInt(id) <= 0 || !Number.isInteger(Number(id))) {
        return Validator.createValidateResult([{ field: 'ID', message: 'Invalid ID. ID must be a positive integer.' }]);
    }
    return Validator.createValidateResult([]);
}

function validateObjectGame(game) {
    if (!game || typeof game !== 'object') {
        return Validator.createValidateResult([{ field: 'Game', message: 'Invalid game data. Game must be an object.' }]);
    }
    return Validator.createValidateResult([]);
}

export function validateGame(game, isUpdate = false) {
    let validationResult = validateObjectGame(game);
    if (!validationResult.valid) { return validationResult; }
    
    let errors = checkRequiredFields(game, isUpdate).errors;
    
    validationResult = Validator.checkFieldsType(game, 'string', GC.TextFields);
    if(!validationResult.valid){ errors = errors.concat(validationResult.errors);}

    validationResult = Validator.checkFieldsType(game, 'number', GC.NumericFields);
    if(!validationResult.valid){ errors = errors.concat(validationResult.errors);}

    // Validate fields value if present, ignore unknown fields and skip validation for undefined or null optional fields
    for (const [field, value] of Object.entries(game)) {
        if (!GC.Fields.includes(field))                        { continue; }    // Ignore unknown fields
        if (game[field] === undefined || game[field] === null) { continue; }    // Skip validation for undefined or null optional fields
        validationResult = fieldsValidator(field)(value);
        if (!validationResult.valid) { errors = errors.concat(validationResult.errors); }
    }
    
    if (game.MinPlayer !== undefined && game.MaxPlayer !== undefined) {
        let playerValidation =  validatePlayerCount(game.MinPlayer, game.MaxPlayer);  
        if (!playerValidation.valid) { errors = errors.concat(playerValidation.errors); }
    }

    return Validator.createValidateResult(errors);
}

function validateDescription(description)   { return Validator.validateText(description, 'Description');                        }
function validateName(name)                 { return Validator.validateText(name,        'Name', false);                        }

function validateImageUrl(imageUrl, field) { return Validator.validateUrl(imageUrl,   field,      GC.ImageAcceptedProtocols);   }
function validateLocation(location)        { return Validator.validateRegex(location, 'Location', GC.LocationRegex);            }

function validatePlayer(player, field)     { return Validator.validateNumberRange(player,  field,  GC.MinPlayer);               }
function validatePlayerAge(age)            { return Validator.validateNumberRange(age,     'Age',  GC.MinAge);                  }
function validateTime(time)                { return Validator.validateNumberRange(time,    'Time', GC.MinTime);                 }
function validateYear(year)                { return Validator.validateNumberRange(year,    'Year', GC.MinYear, GC.MaxYear);     }

function validatePlayerCount(minPlayers, maxPlayers) {
    return (minPlayers > maxPlayers)
            ? Validator.createValidateResult([{ field: 'Player', message: 'Invalid player count. Minimum players cannot be greater than maximum players.' }])
            : Validator.createValidateResult([]);
}