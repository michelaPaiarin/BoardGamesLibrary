export const GAME_CONSTRAINTS = {
    RequireFields: ["name", "minPlayer", "maxPlayer", "time", "location"],
    OptionalFields: ["description", "bigImage", "smallImage", "year"],
    MinPlayers: 1,
    MinTime: 1,
    MinYear: 1900,
    MaxYear: new Date().getFullYear(),
    LocationRegex: /^[A-Z]\.\d+\.\d+$/,
    ImageAcceptedProtocols: ['http:', 'https:']
};