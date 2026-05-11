export const GAME_CONSTRAINTS = {
    Fields: ["Name", "MinPlayer", "MaxPlayer", "MinAge", "Time", "Location", "Description", "UrlBigImage", "UrlSmallImage", "Year"],
    RequireFields: ["Name", "MinPlayer", "MaxPlayer", "Time", "Location", "MinAge"],
    OptionalFields: ["Description", "UrlBigImage", "UrlSmallImage", "Year"],
    MinimalConstraints: ["MinPlayers", "MinTime", "MinPlayerAge", "MinYear"],
    MaximalConstraints: ["MaxYear"],
    MinPlayers: 1,
    MinTime: 1,
    MinPlayerAge: 2,
    MinYear: 1900,
    MaxYear: new Date().getFullYear(),
    LocationRegex: /^[A-Z]\.\d+\.\d+$/,
    ImageAcceptedProtocols: ['http:', 'https:']
};