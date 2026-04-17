const REQUIRED_FIELDS = ['name', 'minPlayer', 'maxPlayer', 'time', 'location'];
const OPTIONAL_FIELDS = ['description', 'bigImage', 'smallImage', 'year'];

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
        for (const field of REQUIRED_FIELDS) {
            validationResult = validateRequiredField(game[field], field);
            if (!validationResult.valid) { return validationResult; }
        }
    }

    for (const field in game) {
        if (!REQUIRED_FIELDS.includes(field) && !OPTIONAL_FIELDS.includes(field)) {
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
    
    if (!isUpdate()) { // If it's a new game, last checks
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
    console.log(`Validating image URL: ${imageUrl}`);
    return { valid: true };
}

function validatePlayer(player){
    console.log(`Validating player: ${player}`);
    return { valid: true };
}

function validateTime(time){
    console.log(`Validating time: ${time}`);
    return { valid: true };
}

function validateLocation(location){
    console.log(`Validating location: ${location}`);
    return { valid: true };
}

function validateDescription(description){
    console.log(`Validating description: ${description}`);
    return { valid: true };
}

function validateYear(year){
    console.log(`Validating year: ${year}`);
    return { valid: true };
}

function validatePlayerCount(minPlayers, maxPlayers) {
    console.log(`Validating player count: ${minPlayers} - ${maxPlayers}`);
    return { valid: true };
}

export default {
    validateID, validateGame
}