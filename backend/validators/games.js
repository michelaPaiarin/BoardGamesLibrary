import { GAME_CONSTRAINTS } from '../config/gameConstraints.js';

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

    if (!isUpdate) {
        for (const field of GAME_CONSTRAINTS.RequireFields) {
            validationResult = validateRequiredField(game[field], field);
            if (!validationResult.valid) { return validationResult; }
        }
    }

    for (const field in game) {
        if (!GAME_CONSTRAINTS.RequireFields.includes(field) && !GAME_CONSTRAINTS.OptionalFields.includes(field)) {
            continue; // Ignore unknown fields
        }else {
            console.log(`Validating field: ${field}`);
            if (game[field] === undefined || game[field] === null) {
                continue; // Skip validation for undefined or null optional fields
            }

            switch (field) {
                case 'name': validationResult = validateName(game); break;
                case 'bigImage': validationResult = validateImageUrl(game.bigImage); break;
                case 'smallImage': validationResult = validateImageUrl(game.smallImage); break;
                case 'minPlayer': validationResult = validatePlayer(game.minPlayer); break;
                case 'maxPlayer': validationResult = validatePlayer(game.maxPlayer); break;
                case 'time': validationResult = validateTime(game.time); break;
                case 'location': validationResult = validateLocation(game.location); break;
                case 'description': validationResult = validateDescription(game.description); break;
                case 'year': validationResult = validateYear(game.year); break;
            }

            if (!validationResult.valid) { return validationResult; }
        }
    }
    
    if (!isUpdate) { // If it's a new game, last checks
        return validatePlayerCount(game.minPlayer, game.maxPlayer)
    }

    return { valid: true };
}

export function validateRequiredField(field, fieldName) {
    if (field === undefined || field === null) {
        return { valid: false, message: `Field '${fieldName}' is required.` };
    }
    return { valid: true };
}

function validateName(game) {
    if(typeof game.name !== 'string') {
        return { valid: false, message: 'Invalid game name. Name must be a string.' };
    } else if(game.name.trim() === '') {
        return { valid: false, message: 'Invalid game name. Name cannot be empty.' };
    }
    return { valid: true };
}

function validateImageUrl(imageUrl){
    if (typeof imageUrl !== 'string') {
        return { valid: false, message: 'Invalid image URL. Image URL must be a string.' };
    }

    if (imageUrl === '') return { valid: true };

    try {
        let url = new URL(imageUrl);
        if (GAME_CONSTRAINTS.ImageAcceptedProtocols.indexOf(url.protocol) === -1) {
            return { valid: false, message: 'Invalid image URL. Image URL must start with ' + GAME_CONSTRAINTS.ImageAcceptedProtocols.join(' or ') };
        }
    } catch (error) {
        return { valid: false, message: 'Invalid image URL. Image URL must be a valid URL.' };
    }
    return { valid: true };
}

function validatePlayer(player){
    if (isNaN(player)){
        return { valid: false, message: 'Invalid player count. Player count must be a number.' };
    }else if(parseInt(player) < GAME_CONSTRAINTS.MinPlayers) {
        return { valid: false, message: 'Invalid player count. Player count must be greater than or equal to ' + GAME_CONSTRAINTS.MinPlayers };
    }
    return { valid: true };
}

function validateTime(time){
    if (isNaN(time)){
        return { valid: false, message: 'Invalid time. Time must be a number.' };
    }else if(parseInt(time) < GAME_CONSTRAINTS.MinTime) {
        return { valid: false, message: 'Invalid time. Time must be greater than or equal to ' + GAME_CONSTRAINTS.MinTime };
    }

    return { valid: true };
}

function validateLocation(location){
    if (typeof location !== 'string') {
        return { valid: false, message: 'Invalid location. Location must be a string.' };
    } else if (!GAME_CONSTRAINTS.LocationRegex.test(location)) {
        return { valid: false, message: 'Invalid location. Location must match the required format.' };
    }

    return { valid: true };
}

function validateDescription(description){
    if (typeof description !== 'string') {
        return { valid: false, message: 'Invalid description. Description must be a string.' };
    }

    if (description === '') return { valid: true };

    return { valid: true };
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
    if (minPlayers > maxPlayers) {
        return { valid: false, message: 'Invalid player count. Minimum players cannot be greater than maximum players.' };
    } 
    return {valid: true};
}

export default {
    validateID, validateGame
}