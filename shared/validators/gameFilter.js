import { GAME_FILTER_CONSTRAINTS, GAME_FILTER_CONSTRAINTS as GFC} from "../config/gameConstraints.js";
import * as Validator from './common.js';
import * as Error from './errors.js';

const ALLOWED_TEXT_FILTERS_COMBINATIONS = GFC.TextFields.flatMap(
    field => [field,  ...Object.keys(GFC.TextSuffix).map(suffix => `${field}${GFC.SuffixSeparator}${suffix}`)]
)

const ALLOWED_NUMERIC_FILTERS_COMBINATIONS = GFC.NumericFields.flatMap(
    field => [ field, ...Object.keys(GFC.NumericalSuffix).map(suffix => `${field}${GFC.SuffixSeparator}${suffix}`)]
)

const ALLOWED_FILTERS_COMBINATIONS = ALLOWED_TEXT_FILTERS_COMBINATIONS.concat(ALLOWED_NUMERIC_FILTERS_COMBINATIONS);

function fieldsValidator(field){
    if (GFC.TextFields.includes(field))         { return validateText;              }
    else if (GFC.NumericFields.includes(field)) { return validateNumber;            }
    else                                        { throw Error.ERROR_UNKNOWN_FIELDS; }
}

export function cleanFilter(filters){
    return Validator.cleanData(filters, ALLOWED_FILTERS_COMBINATIONS);
}

function checkFiltersType(filters){
    let errors = [];
        
    let validationResult = Validator.checkFieldsType(filters, 'string', ALLOWED_TEXT_FILTERS_COMBINATIONS);
    if(!validationResult.valid){ errors = errors.concat(validationResult.errors);}
    validationResult = Validator.checkFieldsType(filters, 'number', ALLOWED_NUMERIC_FILTERS_COMBINATIONS);
    if(!validationResult.valid){ errors = errors.concat(validationResult.errors);}

    return errors;
}

export function validateFilter(filters){
    let errors = checkFiltersType(filters);

    for(const field of GAME_FILTER_CONSTRAINTS.FilterableFields){
        const fieldFiltersEntries = Object.entries(filters).filter(([key, value]) => key.startsWith(`${field}${GFC.SuffixSeparator}`));
        if(fieldFiltersEntries.length == 0){ continue; }
        
        const validationResult = fieldsValidator(field)(fieldFiltersEntries, field);
        if(!validationResult.valid){ errors = errors.concat(validationResult.errors);}
    }

    return Validator.createValidateResult(errors);
}

// filters = [['Name_c', 'Catan']]
function validateText(filters, fieldName){
    if(filters.length !== 1){ return Validator.createValidateResult([{ field: fieldName, message: `Only one text filter criteria for ${fieldName} is allowed.`}]);}
    return  Validator.validateText(filters[0][1], fieldName, false);
}

// filters = [['Player_gt', 3], ['Player_lt', 5]]
function validateNumber(filters, fieldName){
    let errors = [];

    for(const [key, value] of filters)  { errors = errors.concat(Validator.validateNumberRange(value, key).errors);}
    if(errors.length > 0)               { return Validator.createValidateResult(errors); }

    const suffixes = filters.map(([field]) => field.split(GFC.SuffixSeparator)[1]).filter(Boolean);

    if(suffixes.includes('eq') && suffixes.length > 1){ errors.push({ field: fieldName, message: `The equality operator 'eq' for ${fieldName} cannot be combined with other limits.`});}

    for(const group of GFC.ExclusiveNumberSuffixGroups){
        const conflicts = suffixes.filter(suffix => group.includes(suffix));
        if (conflicts.length > 1) { errors.push({ field: fieldName, message: `Cannot combine conflicting operators ${conflicts.join("' and '")} for ${fieldName}.`});}
    }

    return Validator.createValidateResult(errors);
}