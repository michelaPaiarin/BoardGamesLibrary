export const GAME_CONSTRAINTS = {
    Fields: ["Name", "MinPlayer", "MaxPlayer", "MinAge", "Time", "Location", "Description", "UrlBigImage", "UrlSmallImage", "Year"],
    RequireFields: ["Name", "MinPlayer", "MaxPlayer", "Time", "Location", "MinAge"],
    OptionalFields: ["Description", "UrlBigImage", "UrlSmallImage", "Year"],
    NumericFields: ["MinPlayer", "MaxPlayer", "MinAge", "Time", "Year"],
    TextFields: ["Name", "Location", "Description", "UrlBigImage", "UrlSmallImage"],
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

export const GAME_FILTER_CONSTRAINTS = {
    FilterableFields:   [...GAME_CONSTRAINTS.RequireFields, 'Year', 'Player', 'Age', 'Room'],
    NumericFields:      [...GAME_CONSTRAINTS.NumericFields, 'Player', 'Age'],
    TextFields:         [...GAME_CONSTRAINTS.TextFields, 'Room'],
    AbstractFilters:    ['Player', 'Age', 'Room'],
    NumericalSuffix:    { 'eq': '=', 'ge': '>=', 'le': '<=', 'gt': '>', 'lt': '<' },
    TextSuffix:         { 'e': '=', 'c': 'LIKE' },
    ExclusiveNumberSuffixGroups: [['ge', 'gt'], ['le', 'lt']],

    SuffixSeparator: '_',
    ValidRoom: /^[A-Z]?$/,
    LocationRegex: GAME_CONSTRAINTS.LocationRegex,
    LocationContainsRegex: /^[A-Z](\.\d+(\.\d+)?)?$/
}