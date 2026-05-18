import { GAME_FILTER_CONSTRAINTS as GFC} from "../sharedExports.js";

const SUFFIX_TRANSLATOR = {...GFC.NumericalSuffix, ...GFC.TextSuffix};

export function buildWhereClause(filter){
    let clauseCondition = [], params = [];

    if (!filter || Object.keys(filter).length === 0) { return { sqlClause: "", params: [] }; }      //Let's skip the empty case. This should never happen.
    
    Object.entries(filter).forEach(([key, value]) => {
        const [field, suffix] = key.split(GFC.SuffixSeparator);
        const operator = SUFFIX_TRANSLATOR[suffix];
        try{
            if(GFC.AbstractFilters.includes(field)){
                const [clauseString, values] = getAbstractFiltersQuery(field, suffix, operator, value);
                clauseCondition.push(clauseString), params.push(...values);
            }else{
                clauseCondition.push(`${field} ${operator} ?`);  params.push((operator === 'LIKE') ? `%${value}%` : value);
            }
        }catch(e){return;}                                                                          //Let's skip the ones we don't know. This should never happen.
    });

    const sqlClause = " WHERE " + clauseCondition.join(" AND ");
    return {sqlClause, params};    
}

function getAbstractFiltersQuery(field, suffix, operator, value){
    let condition, params = []
    switch (field) {
        case 'Player':
            switch (suffix) {
                case 'eq':              condition = `MinPlayer <= ? AND MaxPlayer >= ?`;   params.push(value, value);  break;
                case 'gt':  case 'ge':  condition = `MaxPlayer ${operator} ?`;             params.push(value);         break;
                case 'lt':  case 'le':  condition = `MinPlayer ${operator} ?`;             params.push(value);         break;
            }
            break;
        case 'Age':                     condition = `MinAge ${operator} ?`;                params.push(value);         break;
        case 'Room':                    condition = `Location LIKE ?`;                     params.push(`${value}.%`);  break;
        default:                        throw new Error("Unknown field ");
    }
    
    return [condition, params];
}