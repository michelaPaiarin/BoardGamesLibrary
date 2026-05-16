/**
 * Test suite for the game filter validator.
 * Run with: node test/testFilterValidator.js
 * * Note: This test script was generated with AI assistance to stress-test 
 * the complex filter validation logic, including suffix parsing, type checking, 
 * and exclusive operator conflicts (e.g., preventing 'gt' and 'ge' together). 
 * While not part of the production server code, it is a crucial tool for 
 * the development and QA process to ensure robust and secure API querying.
 */

import { validateFilter } from '../sharedExports.js';

const testCases = [
    // --- GRUPPO 1: BASE E TESTO (10 test) ---
    { name: "1. Filtro vuoto (Valido)", input: {}, expected: true },
    { name: "2. Filtro Name_c valido", input: { Name_c: "Catan" }, expected: true },
    { name: "3. Filtro Name_e valido", input: { Name_e: "Risiko" }, expected: true },
    { name: "4. Filtro Room_c valido", input: { Room_c: "A" }, expected: true },
    { name: "5. Filtro misto valido", input: { Name_c: "Gloomhaven", Time_lt: 120 }, expected: true },
    { name: "6. Conflitto Testo: Name_c e Name_e", input: { Name_c: "Ca", Name_e: "Catan" }, expected: false },
    { name: "7. Conflitto Testo: Room_c e Room_e", input: { Room_c: "A", Room_e: "B" }, expected: false },
    { name: "8. Errore Tipo: Name_c non è stringa", input: { Name_c: 123 }, expected: false },
    { name: "9. Errore Tipo: Room_e non è stringa", input: { Room_e: true }, expected: false },
    { name: "10. Nessun conflitto su campi testo diversi", input: { Name_c: "Ca", Room_c: "A" }, expected: true },

    // --- GRUPPO 2: NUMERICI SINGOLI (EQ) (8 test) ---
    { name: "11. Time_eq valido", input: { Time_eq: 60 }, expected: true },
    { name: "12. Player_eq valido", input: { Player_eq: 4 }, expected: true },
    { name: "13. MinPlayer_eq valido", input: { MinPlayer_eq: 2 }, expected: true },
    { name: "14. MaxPlayer_eq valido", input: { MaxPlayer_eq: 6 }, expected: true },
    { name: "15. Age_eq valido", input: { Age_eq: 12 }, expected: true },
    { name: "16. Bookcase_eq valido", input: { Bookcase_eq: 1 }, expected: true },
    { name: "17. Shelf_eq valido", input: { Shelf_eq: 3 }, expected: true },
    { name: "18. Errore Tipo: Time_eq stringa", input: { Time_eq: "sessanta" }, expected: false },

    // --- GRUPPO 3: NUMERICI RANGE VALIDI (10 test) ---
    { name: "19. Time gt e lt validi", input: { Time_gt: 30, Time_lt: 90 }, expected: true },
    { name: "20. Player ge e le validi", input: { Player_ge: 2, Player_le: 5 }, expected: true },
    { name: "21. Age gt e le validi", input: { Age_gt: 10, Age_le: 18 }, expected: true },
    { name: "22. MinPlayer ge e lt validi", input: { MinPlayer_ge: 1, MinPlayer_lt: 4 }, expected: true },
    { name: "23. MaxPlayer gt e lt validi", input: { MaxPlayer_gt: 4, MaxPlayer_lt: 10 }, expected: true },
    { name: "24. Bookcase ge e le validi", input: { Bookcase_ge: 1, Bookcase_le: 3 }, expected: true },
    { name: "25. Shelf gt e lt validi", input: { Shelf_gt: 1, Shelf_lt: 5 }, expected: true },
    { name: "26. Range misto su campi diversi", input: { Time_gt: 30, Player_lt: 5 }, expected: true },
    { name: "27. Solo ge senza massimi", input: { Time_ge: 60 }, expected: true },
    { name: "28. Solo le senza minimi", input: { Player_le: 4 }, expected: true },

    // --- GRUPPO 4: CONFLITTI CON EQ (12 test) ---
    { name: "29. Conflitto EQ: Time_eq + Time_gt", input: { Time_eq: 60, Time_gt: 50 }, expected: false },
    { name: "30. Conflitto EQ: Time_eq + Time_lt", input: { Time_eq: 60, Time_lt: 90 }, expected: false },
    { name: "31. Conflitto EQ: Player_eq + Player_ge", input: { Player_eq: 4, Player_ge: 2 }, expected: false },
    { name: "32. Conflitto EQ: Player_eq + Player_le", input: { Player_eq: 4, Player_le: 6 }, expected: false },
    { name: "33. Conflitto EQ: Age_eq + Age_gt", input: { Age_eq: 14, Age_gt: 10 }, expected: false },
    { name: "34. Conflitto EQ: MinPlayer_eq + MinPlayer_lt", input: { MinPlayer_eq: 2, MinPlayer_lt: 5 }, expected: false },
    { name: "35. Conflitto EQ: MaxPlayer_eq + MaxPlayer_ge", input: { MaxPlayer_eq: 8, MaxPlayer_ge: 4 }, expected: false },
    { name: "36. Conflitto EQ: Bookcase_eq + Bookcase_gt", input: { Bookcase_eq: 2, Bookcase_gt: 1 }, expected: false },
    { name: "37. Conflitto EQ: Shelf_eq + Shelf_lt", input: { Shelf_eq: 3, Shelf_lt: 5 }, expected: false },
    { name: "38. Triplo EQ (non valido)", input: { Time_eq: 60, Time_gt: 30, Time_lt: 90 }, expected: false },
    { name: "39. Nessun conflitto EQ tra campi diversi", input: { Time_eq: 60, Player_gt: 2 }, expected: true },
    { name: "40. Due EQ su campi diversi", input: { Time_eq: 60, Player_eq: 4 }, expected: true },

    // --- GRUPPO 5: CONFLITTI DI ESCLUSIVITÀ (GE vs GT / LE vs LT) (12 test) ---
    { name: "41. Conflitto Esclusivo: Time ge + gt", input: { Time_ge: 30, Time_gt: 30 }, expected: false },
    { name: "42. Conflitto Esclusivo: Time le + lt", input: { Time_le: 90, Time_lt: 90 }, expected: false },
    { name: "43. Conflitto Esclusivo: Player ge + gt", input: { Player_ge: 2, Player_gt: 2 }, expected: false },
    { name: "44. Conflitto Esclusivo: Player le + lt", input: { Player_le: 5, Player_lt: 5 }, expected: false },
    { name: "45. Conflitto Esclusivo: Age ge + gt", input: { Age_ge: 10, Age_gt: 12 }, expected: false },
    { name: "46. Conflitto Esclusivo: Age le + lt", input: { Age_le: 18, Age_lt: 16 }, expected: false },
    { name: "47. Conflitto Esclusivo: MinPlayer ge + gt", input: { MinPlayer_ge: 2, MinPlayer_gt: 3 }, expected: false },
    { name: "48. Conflitto Esclusivo: MaxPlayer le + lt", input: { MaxPlayer_le: 6, MaxPlayer_lt: 5 }, expected: false },
    { name: "49. Conflitto Esclusivo: Bookcase ge + gt", input: { Bookcase_ge: 1, Bookcase_gt: 2 }, expected: false },
    { name: "50. Conflitto Esclusivo: Shelf le + lt", input: { Shelf_le: 4, Shelf_lt: 3 }, expected: false },
    { name: "51. Conflitto Totale: gt + ge + lt + le", input: { Time_gt: 10, Time_ge: 10, Time_lt: 50, Time_le: 50 }, expected: false },
    { name: "52. Nessun conflitto esclusivo tra campi diversi", input: { Time_ge: 30, Player_gt: 2 }, expected: true }
];

console.log("==========================================");
console.log("🚀 AVVIO TEST DI VALIDAZIONE FILTRI (52) 🚀");
console.log("==========================================");

let passed = 0;
let failed = 0;

testCases.forEach((test, index) => {
    try {
        const result = validateFilter(test.input);
        
        if (result.valid === test.expected) {
            passed++;
            console.log(`✅ [TEST ${index + 1}] PASSATO: ${test.name}`); 
        } else {
            failed++;
            console.log(`\n❌ [TEST ${index + 1}] FALLITO: ${test.name}`);
            console.log(`   Input:`, test.input);
            console.log(`   Atteso valid=${test.expected}, ma ottenuto valid=${result.valid}`);
            console.log(`   Errori:`, result.errors);
        }
    } catch (error) {
        failed++;
        console.log(`\n💥 [TEST ${index + 1}] CRASH: ${test.name}`);
        console.log(error);
    }
});

console.log("\n==========================================");
console.log(`📊 RISULTATI FINALI:`);
console.log(`✅ Passati: ${passed}`);
console.log(`❌ Falliti: ${failed}`);
if (failed === 0) {
    console.log(`🎉 TUTTI I TEST SONO PASSATI! IL CODICE È BLINDATO! 🎉`);
}
console.log("==========================================");