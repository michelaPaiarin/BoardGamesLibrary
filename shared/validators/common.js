import * as Error from "./errors.js"

function isNumber(str) { return !isNaN(Number(str)); }

export function cleanData(data, AcceptedFields, isEmptyStringOk = false){
    let cleanedData = {}
    for(const [field, value] of Object.entries(data)){
        if (!AcceptedFields.includes(field)) { continue; }

        if(typeof value === 'string'){
            const trimmedString = value.trim();
            cleanedData[field] = (trimmedString === '')
                                ? (isEmptyStringOk ? '' : null)
                                : isNumber(trimmedString)
                                    ? Number(trimmedString)
                                    : trimmedString;
        }else if(typeof value === 'number' || value === null){
            cleanedData[field] = value;
        }else{
            throw Error.ERROR_INVALID_DATA_TYPE;
        }
    }
    return cleanedData;
}

export function createValidateResult(errorsArray){
    return { valid: (errorsArray.length === 0), errors: errorsArray };
}

export function arrayIntersection(array1, array2){
    return array1.filter(value => array2.includes(value));
}

function checkValueRequire(fieldName, value){
    return (value === null) 
            ? { valid: false, message: `${fieldName} can't be null.` }
            : { valid: true};
}

export function checkRequireFields(data, requiredFields){
    let errors = [];

    for (const field of requiredFields) {
        const value = data[field];
        if(value === undefined){
            errors.push({ field: field, message: `${field} is required.` });
        } else {
            const check = checkValueRequire(field, data[field]);
            if (!check.valid){ errors.push({ field: field, message: check.message }); }
        }
    }

    return createValidateResult(errors);
}

//accept value if is the same type or undefined or null
export function checkFieldsType (data, type, fieldsArray){
    let errors = [];

    for (const field of fieldsArray) {
        const value = data[field];

        if (value === undefined || value === null) { continue;                                                                      }
        if (typeof value !== type)                 { errors.push({ field: field, message: `${field} must be of type ${type}.` });   }
    }

    return createValidateResult(errors);
}

export function validateNumberRange(value, fieldName, min = null, max = null){
    let error = [];
    if (isNaN(value))                { return createValidateResult([{ field: fieldName, message: `${fieldName} must be a number.`     }]); }
    if (min !== null && value < min) { error.push({ field: fieldName, message: `${fieldName} must be greater than or equal to ${min}.`} ); }
    if (max !== null && value > max) { error.push({ field: fieldName, message: `${fieldName} must be less than or equal to ${max}.`   } ); }

    return createValidateResult(error);
}

export function validateUrl(url, fieldName, protocols){
    if (typeof url !== 'string')    { return createValidateResult([{ field: fieldName, message: `${fieldName}' must be a string`}]); }
    
    let message = null;
    try { if (protocols.indexOf((new URL(url)).protocol) === -1) { message = `${fieldName} must start with ` + protocols.join(' or '); }}
    catch (error)                                                { message = `${fieldName} must be a valid URL.`;                       }
        
    return createValidateResult((message == null) ? [] : [{ field: fieldName, message: message}]);
}

export function validateRegex(text, fieldName, regexRule) {
    if (typeof text !== 'string')   { return createValidateResult([{ field: fieldName, message: `${fieldName} must be a string.`               }]); }
    if (!regexRule.test(text))      { return createValidateResult([{ field: fieldName, message: `${fieldName} must match the required format.` }]); }
    return createValidateResult([]);
}

export function validateText(text, fieldName, isNullOk = true){
    if (typeof text !== 'string')   { return createValidateResult([{ field: fieldName, message: `${fieldName} must be a string.`                        }]); }
    if (!isNullOk && (text === null || text === undefined)){ return createValidateResult([{ field: fieldName, message: `${fieldName} must have a value` }]); }
    return createValidateResult([]);
}