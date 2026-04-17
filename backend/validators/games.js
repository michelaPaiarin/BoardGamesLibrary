export function validateID(id) {
    if (!id || isNaN(id) || parseInt(id) <= 0) {
        return { valid: false, message: 'Invalid ID. ID must be a positive integer.' };
    }
    return { valid: true };
}

export function validateGame(game) {
    console.log("starting game validation", game);
    return { valid: true };
}

export default {
    validateID, validateGame
}