/**
 * Test suite for the game validator.
 * Run with: node test/testValidator.js
 * * Note: This test script was generated with AI assistance to stress-test 
 * the validation logic. While not part of the production server code, 
 * it is a crucial tool for the development and QA process.
 */

import { validateGame, cleanGameData } from '../validators/games.js';

console.log("====================================================");
console.log("🚀 AVVIO SUITE DI TEST: VALIDATORE GIOCHI");
console.log("====================================================\n");

const testCases = [
    // ==========================================
    // 1. TEST VALIDI (POST & PUT)
    // ==========================================
    {
        description: "POST: Gioco perfetto e completo",
        isUpdate: false, expectValid: true,
        payload: { Name: "Catan", UrlBigImage: "https://example.com/catan.jpg", UrlSmallImage: "", MinPlayer: "3", MaxPlayer: "4", MinAge: "10", Time: "120", Year: "1995", Location: "A.1.2", Description: "Un gioco fantastico." }
    },
    {
        description: "POST: Solo campi obbligatori",
        isUpdate: false, expectValid: true,
        payload: { Name: "Scacchi", MinPlayer: "2", MaxPlayer: "2", MinAge: "6", Time: "60", Location: "B.3.4" }
    },
    {
        description: "PUT: Aggiornamento singolo (Tempo)",
        isUpdate: true, expectValid: true,
        payload: { Time: "180" }
    },
    {
        description: "PUT: Svuotamento campi opzionali (Spazi vuoti -> diventano null e passano)",
        isUpdate: true, expectValid: true,
        payload: { UrlBigImage: "   ", Description: "   " }
    },
    {
        description: "PUT: Campi sconosciuti vengono ignorati pacificamente",
        isUpdate: true, expectValid: true,
        payload: { Name: "Risiko", Prezzo: "45", Scaffale: "Alto" }
    },

    // ==========================================
    // 2. CAMPI OBBLIGATORI MANCANTI (POST)
    // ==========================================
    { description: "POST Inv: Manca Name", isUpdate: false, expectValid: false, payload: { MinPlayer: "2", MaxPlayer: "4", MinAge: "10", Time: "60", Location: "C.3.3" } },
    { description: "POST Inv: Manca MinPlayer", isUpdate: false, expectValid: false, payload: { Name: "Test", MaxPlayer: "4", MinAge: "10", Time: "60", Location: "C.3.3" } },
    { description: "POST Inv: Manca MaxPlayer", isUpdate: false, expectValid: false, payload: { Name: "Test", MinPlayer: "2", MinAge: "10", Time: "60", Location: "C.3.3" } },
    { description: "POST Inv: Manca MinAge", isUpdate: false, expectValid: false, payload: { Name: "Test", MinPlayer: "2", MaxPlayer: "4", Time: "60", Location: "C.3.3" } },
    { description: "POST Inv: Manca Time", isUpdate: false, expectValid: false, payload: { Name: "Test", MinPlayer: "2", MaxPlayer: "4", MinAge: "10", Location: "C.3.3" } },
    { description: "POST Inv: Manca Location", isUpdate: false, expectValid: false, payload: { Name: "Test", MinPlayer: "2", MaxPlayer: "4", MinAge: "10", Time: "60" } },

    // ==========================================
    // 3. CAMPI VUOTI/NULL (Il Clean li blocca sui required)
    // ==========================================
    { description: "POST Inv: Name è solo spazi vuoti", isUpdate: false, expectValid: false, payload: { Name: "   ", MinPlayer: "2", MaxPlayer: "4", MinAge: "10", Time: "60", Location: "C.3.3" } },
    { description: "PUT Inv: Location svuotata in update", isUpdate: true, expectValid: false, payload: { Location: "   " } },
    { description: "PUT Inv: Name settato a null esplicitamente", isUpdate: true, expectValid: false, payload: { Name: null } },

    // ==========================================
    // 4. TIPI DI DATO SBAGLIATI
    // ==========================================
    { description: "PUT Inv: Name come Numero", isUpdate: true, expectValid: false, payload: { Name: 12345 } },
    { description: "PUT Inv: Description come Oggetto", isUpdate: true, expectValid: false, payload: { Description: { testo: "Ciao" } } },
    { description: "PUT Inv: Location come Booleano", isUpdate: true, expectValid: false, payload: { Location: true } },

    // ==========================================
    // 5. VALIDAZIONE GIOCATORI E ETA'
    // ==========================================
    { description: "PUT Inv: MinPlayer non numerico", isUpdate: true, expectValid: false, payload: { MinPlayer: "due" } },
    { description: "PUT Inv: MinPlayer negativo", isUpdate: true, expectValid: false, payload: { MinPlayer: "-2" } },
    { description: "PUT Inv: MinPlayer zero", isUpdate: true, expectValid: false, payload: { MinPlayer: "0" } },
    { description: "POST Inv: MinPlayer > MaxPlayer", isUpdate: false, expectValid: false, payload: { Name: "Test", MinPlayer: "6", MaxPlayer: "2", MinAge: "10", Time: "60", Location: "C.3.3" } },
    
    { description: "PUT Inv: MinAge non numerico", isUpdate: true, expectValid: false, payload: { MinAge: "dieci" } },
    { description: "PUT Inv: MinAge negativo", isUpdate: true, expectValid: false, payload: { MinAge: "-5" } },

    // ==========================================
    // 6. VALIDAZIONE TEMPO E ANNO
    // ==========================================
    { description: "PUT Inv: Time non numerico", isUpdate: true, expectValid: false, payload: { Time: "un'ora" } },
    { description: "PUT Inv: Time negativo", isUpdate: true, expectValid: false, payload: { Time: "-30" } },
    
    { description: "PUT Inv: Year non numerico", isUpdate: true, expectValid: false, payload: { Year: "duemila" } },
    { description: "PUT Inv: Year prima del limite (es. 1800)", isUpdate: true, expectValid: false, payload: { Year: "1800" } },
    { description: "PUT Inv: Year nel futuro remoto (3000)", isUpdate: true, expectValid: false, payload: { Year: "3000" } },

    // ==========================================
    // 7. VALIDAZIONE LOCATION (Regex)
    // ==========================================
    { description: "PUT Inv: Location senza punti (A12)", isUpdate: true, expectValid: false, payload: { Location: "A12" } },
    { description: "PUT Inv: Location minuscola (a.1.2)", isUpdate: true, expectValid: false, payload: { Location: "a.1.2" } },
    { description: "PUT Inv: Location formato testo (Scaffale)", isUpdate: true, expectValid: false, payload: { Location: "Scaffale in alto" } },
    { description: "PUT Inv: Location troppi blocchi (A.1.2.3)", isUpdate: true, expectValid: false, payload: { Location: "A.1.2.3" } },

    // ==========================================
    // 8. VALIDAZIONE IMMAGINI (URL)
    // ==========================================
    { description: "PUT Inv: UrlBigImage senza http/https (ftp)", isUpdate: true, expectValid: false, payload: { UrlBigImage: "ftp://mio-server.com/img.jpg" } },
    { description: "PUT Inv: UrlSmallImage javascript injection (XSS)", isUpdate: true, expectValid: false, payload: { UrlSmallImage: "javascript:alert('Hack!')" } },
    { description: "PUT Inv: UrlBigImage stringa a caso non URL", isUpdate: true, expectValid: false, payload: { UrlBigImage: "non_sono_un_url_valido" } },
    { description: "PUT Inv: UrlSmallImage come oggetto", isUpdate: true, expectValid: false, payload: { UrlSmallImage: { url: "http://test.com/img.jpg" } } }
];

let testsPassed = 0;
let testsFailed = 0;

testCases.forEach((test, index) => {
    // 1. SIMULIAMO IL CONTROLLER: Puliamo i dati prima!
    const cleanedPayload = cleanGameData({ ...test.payload }); 

    // 2. VALIDIAMO i dati puliti
    const result = validateGame(cleanedPayload, test.isUpdate);
    const testNumber = String(index + 1).padStart(2, '0');
    console.log(result);
    if (result.valid === test.expectValid) {
        console.log(`✅ Test ${testNumber} PASSATO | ${test.description}`);
        testsPassed++;
    } else {
        console.log(`❌ Test ${testNumber} FALLITO | ${test.description}`);
        console.log(`   -> Payload Inviato (dopo Clean):`, cleanedPayload);
        console.log(`   -> Aspettativa: valid = ${test.expectValid}`);
        console.log(`   -> Risultato: valid = ${result.valid}`);
        if (!result.valid) {
            console.log(`   -> Messaggio d'errore ricevuto: "${result.message}"`);
        }
        testsFailed++;
    }
});

console.log("\n====================================================");
console.log(`📊 RISULTATO FINALE: ${testsPassed}/${testCases.length} Test Passati`);
if (testsFailed === 0) {
    console.log("🏆 PERFETTO!");
} else {
    console.log(`⚠️ Ci sono ${testsFailed} test da correggere nel validatore.`);
}
console.log("====================================================\n");