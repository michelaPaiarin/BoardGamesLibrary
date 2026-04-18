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
    // 1. I CAMMINI DORATI (THE GOLDEN PATHS)
    // ==========================================
    { description: "POST: Gioco perfetto e completo", isUpdate: false, expectValid: true, payload: { Name: "Catan", UrlBigImage: "https://example.com/catan.jpg", UrlSmallImage: "http://site.com/small.png", MinPlayer: "3", MaxPlayer: "4", MinAge: "10", Time: "120", Year: "1995", Location: "A.1.2", Description: "Un gioco fantastico." } },
    { description: "POST: Solo campi obbligatori (Minimal)", isUpdate: false, expectValid: true, payload: { Name: "Scacchi", MinPlayer: "2", MaxPlayer: "2", MinAge: "6", Time: "60", Location: "B.3.4" } },
    { description: "PUT: Aggiornamento singolo di un campo obbligatorio", isUpdate: true, expectValid: true, payload: { Time: "180" } },
    { description: "PUT: Aggiornamento singolo di un campo opzionale", isUpdate: true, expectValid: true, payload: { Year: "2020" } },
    { description: "PUT: Svuotamento esplicito campi opzionali (Spazi vuoti)", isUpdate: true, expectValid: true, payload: { UrlBigImage: "   ", Description: "   " } },
    { description: "PUT: Svuotamento esplicito campi opzionali (Null)", isUpdate: true, expectValid: true, payload: { UrlSmallImage: null, Year: null } },

    // ==========================================
    // 2. ERRORI DI TIPO (TYPE MISMATCHES)
    // ==========================================
    { description: "POST: Name come Numero", isUpdate: false, expectValid: false, payload: { Name: 12345, MinPlayer: "2", MaxPlayer: "4", MinAge: "10", Time: "60", Location: "C.3.3" } },
    { description: "POST: Name come Array", isUpdate: false, expectValid: false, payload: { Name: ["Catan"], MinPlayer: "2", MaxPlayer: "4", MinAge: "10", Time: "60", Location: "C.3.3" } },
    { description: "POST: Name come Oggetto", isUpdate: false, expectValid: false, payload: { Name: { title: "Catan" }, MinPlayer: "2", MaxPlayer: "4", MinAge: "10", Time: "60", Location: "C.3.3" } },
    { description: "POST: Name come Booleano", isUpdate: false, expectValid: false, payload: { Name: true, MinPlayer: "2", MaxPlayer: "4", MinAge: "10", Time: "60", Location: "C.3.3" } },
    { description: "PUT: Description come Oggetto", isUpdate: true, expectValid: false, payload: { Description: { testo: "Ciao" } } },
    { description: "PUT: Location come Booleano", isUpdate: true, expectValid: false, payload: { Location: true } },
    { description: "PUT: MinPlayer non numerico (Stringa alfabetica)", isUpdate: true, expectValid: false, payload: { MinPlayer: "due" } },
    { description: "PUT: Time come Array", isUpdate: true, expectValid: false, payload: { Time: [60] } },

    // ==========================================
    // 3. CAMPI OBBLIGATORI MANCANTI E NULL (POST E PUT)
    // ==========================================
    { description: "POST: Manca Name", isUpdate: false, expectValid: false, payload: { MinPlayer: "2", MaxPlayer: "4", MinAge: "10", Time: "60", Location: "C.3.3" } },
    { description: "POST: Manca MinPlayer", isUpdate: false, expectValid: false, payload: { Name: "Test", MaxPlayer: "4", MinAge: "10", Time: "60", Location: "C.3.3" } },
    { description: "POST: Manca MaxPlayer", isUpdate: false, expectValid: false, payload: { Name: "Test", MinPlayer: "2", MinAge: "10", Time: "60", Location: "C.3.3" } },
    { description: "POST: Manca MinAge", isUpdate: false, expectValid: false, payload: { Name: "Test", MinPlayer: "2", MaxPlayer: "4", Time: "60", Location: "C.3.3" } },
    { description: "POST: Manca Time", isUpdate: false, expectValid: false, payload: { Name: "Test", MinPlayer: "2", MaxPlayer: "4", MinAge: "10", Location: "C.3.3" } },
    { description: "POST: Manca Location", isUpdate: false, expectValid: false, payload: { Name: "Test", MinPlayer: "2", MaxPlayer: "4", MinAge: "10", Time: "60" } },
    { description: "POST: Name è solo spazi vuoti", isUpdate: false, expectValid: false, payload: { Name: "   ", MinPlayer: "2", MaxPlayer: "4", MinAge: "10", Time: "60", Location: "C.3.3" } },
    { description: "PUT: Location svuotata in update (Spazi)", isUpdate: true, expectValid: false, payload: { Location: "   " } },
    { description: "PUT: Name settato a null esplicitamente", isUpdate: true, expectValid: false, payload: { Name: null } },
    { description: "PUT: Time settato a null esplicitamente", isUpdate: true, expectValid: false, payload: { Time: null } },

    // ==========================================
    // 4. TEST SUI LIMITI MATEMATICI (BOUNDARY TESTING)
    // ==========================================
    // Giocatori
    { description: "PUT: MinPlayer negativo", isUpdate: true, expectValid: false, payload: { MinPlayer: "-2" } },
    { description: "PUT: MinPlayer zero", isUpdate: true, expectValid: false, payload: { MinPlayer: "0" } },
    { description: "PUT: MinPlayer limite esatto (1) - VALIDO", isUpdate: true, expectValid: true, payload: { MinPlayer: "1" } },
    { description: "POST: MaxPlayer zero", isUpdate: false, expectValid: false, payload: { Name: "T", MinPlayer: "1", MaxPlayer: "0", MinAge: "10", Time: "60", Location: "A.1.1" } },
    { description: "POST: MinPlayer > MaxPlayer", isUpdate: false, expectValid: false, payload: { Name: "Test", MinPlayer: "6", MaxPlayer: "2", MinAge: "10", Time: "60", Location: "C.3.3" } },
    { description: "POST: MinPlayer == MaxPlayer (Solitario esatto) - VALIDO", isUpdate: false, expectValid: true, payload: { Name: "Solitario", MinPlayer: "1", MaxPlayer: "1", MinAge: "10", Time: "60", Location: "C.3.3" } },
    // Età (Assumendo MinAge >= 2 dal config)
    { description: "PUT: MinAge zero", isUpdate: true, expectValid: false, payload: { MinAge: "0" } },
    { description: "PUT: MinAge negativo", isUpdate: true, expectValid: false, payload: { MinAge: "-5" } },
    { description: "PUT: MinAge limite esatto (2) - VALIDO", isUpdate: true, expectValid: true, payload: { MinAge: "2" } },
    { description: "PUT: MinAge alto ma plausibile (99) - VALIDO", isUpdate: true, expectValid: true, payload: { MinAge: "99" } },
    // Tempo
    { description: "PUT: Time negativo", isUpdate: true, expectValid: false, payload: { Time: "-30" } },
    { description: "PUT: Time zero", isUpdate: true, expectValid: false, payload: { Time: "0" } },
    { description: "PUT: Time limite esatto (1) - VALIDO", isUpdate: true, expectValid: true, payload: { Time: "1" } },
    { description: "PUT: Time enorme (9999) - VALIDO", isUpdate: true, expectValid: true, payload: { Time: "9999" } },
    // Anno (Assumendo 1900 - 2026 dal config)
    { description: "PUT: Year fuori limite inferiore (1899)", isUpdate: true, expectValid: false, payload: { Year: "1899" } },
    { description: "PUT: Year limite inferiore esatto (1900) - VALIDO", isUpdate: true, expectValid: true, payload: { Year: "1900" } },
    { description: "PUT: Year limite superiore esatto (2026) - VALIDO", isUpdate: true, expectValid: true, payload: { Year: "2026" } },
    { description: "PUT: Year fuori limite superiore (2027)", isUpdate: true, expectValid: false, payload: { Year: "2027" } },
    { description: "PUT: Year nel futuro remoto (3000)", isUpdate: true, expectValid: false, payload: { Year: "3000" } },

    // ==========================================
    // 5. SICUREZZA, XSS E CARATTERI STRANI (SANITIZATION)
    // ==========================================
    // Nota: Il validatore dice "è una stringa?", se sì, passa. Sarà il DB a gestire l'escape.
    { description: "PUT: Name con SQL Injection simulata (VALIDO per il validatore, innocuo per DB)", isUpdate: true, expectValid: true, payload: { Name: "Robert'; DROP TABLE games;--" } },
    { description: "PUT: Name con XSS simulata (VALIDO per il validatore)", isUpdate: true, expectValid: true, payload: { Name: "<script>alert('hack')</script>" } },
    { description: "PUT: Name con emoji (VALIDO)", isUpdate: true, expectValid: true, payload: { Name: "Catan 🎲🐑" } },
    { description: "PUT: Description lunghissima (1000 caratteri) - VALIDO", isUpdate: true, expectValid: true, payload: { Description: "A".repeat(1000) } },
    { description: "PUT: Name con spazi ai bordi (Vengono trimmati dal Clean) - VALIDO", isUpdate: true, expectValid: true, payload: { Name: "  Risiko  " } },

    // ==========================================
    // 6. VALIDAZIONE LOCATION (Regex strict)
    // ==========================================
    { description: "PUT: Location perfetta (A.1.1)", isUpdate: true, expectValid: true, payload: { Location: "A.1.1" } },
    { description: "PUT: Location senza punti (A12)", isUpdate: true, expectValid: false, payload: { Location: "A12" } },
    { description: "PUT: Location con trattini (A-1-1)", isUpdate: true, expectValid: false, payload: { Location: "A-1-1" } },
    { description: "PUT: Location minuscola (a.1.2)", isUpdate: true, expectValid: false, payload: { Location: "a.1.2" } },
    { description: "PUT: Location testo a caso (Scaffale)", isUpdate: true, expectValid: false, payload: { Location: "Scaffale" } },
    { description: "PUT: Location troppi blocchi (A.1.2.3)", isUpdate: true, expectValid: false, payload: { Location: "A.1.2.3" } },
    { description: "PUT: Location spazi interni (A . 1 . 1)", isUpdate: true, expectValid: false, payload: { Location: "A . 1 . 1" } },
    { description: "PUT: Location lettera oltre la Z (se regex A-Z, [ o { fallisce)", isUpdate: true, expectValid: false, payload: { Location: "[.1.1" } },
    { description: "PUT: Location con numeri a più cifre (A.10.20) - DIPENDE DALLA TUA REGEX (Assumiamo valida)", isUpdate: true, expectValid: true, payload: { Location: "A.10.20" } },

    // ==========================================
    // 7. VALIDAZIONE IMMAGINI E URL (Regex e Protocolli)
    // ==========================================
    { description: "PUT: UrlBigImage http standard - VALIDO", isUpdate: true, expectValid: true, payload: { UrlBigImage: "http://example.com/img.jpg" } },
    { description: "PUT: UrlBigImage https standard - VALIDO", isUpdate: true, expectValid: true, payload: { UrlBigImage: "https://example.com/img.jpg" } },
    { description: "PUT: UrlBigImage con query params - VALIDO", isUpdate: true, expectValid: true, payload: { UrlBigImage: "https://img.com/pic?w=100&h=100" } },
    { description: "PUT: UrlBigImage senza http/https (ftp)", isUpdate: true, expectValid: false, payload: { UrlBigImage: "ftp://mio-server.com/img.jpg" } },
    { description: "PUT: UrlSmallImage javascript injection (XSS via URL)", isUpdate: true, expectValid: false, payload: { UrlSmallImage: "javascript:alert('Hack!')" } },
    { description: "PUT: UrlBigImage stringa a caso non URL", isUpdate: true, expectValid: false, payload: { UrlBigImage: "non_sono_un_url_valido" } },
    { description: "PUT: UrlBigImage manca protocollo (www.site.com)", isUpdate: true, expectValid: false, payload: { UrlBigImage: "www.example.com/img.jpg" } },
    { description: "PUT: UrlSmallImage come oggetto", isUpdate: true, expectValid: false, payload: { UrlSmallImage: { url: "http://test.com/img.jpg" } } },
    { description: "PUT: UrlBigImage URI locale (file://)", isUpdate: true, expectValid: false, payload: { UrlBigImage: "file:///C:/immagini/gioco.png" } },

    // ==========================================
    // 8. UNRECOGNIZED FIELDS (Comportamento del Validatore puro)
    // ==========================================
    // Nota: Il validatore DEVE restituire true ignorandoli. Sarà il controller a dire "Non c'è niente da aggiornare".
    { description: "PUT: Campi sconosciuti vengono ignorati pacificamente dal validatore", isUpdate: true, expectValid: true, payload: { HackerField: "Drop", Prezzo: 45, Scaffale: "Alto" } },
    { description: "POST: Campi extra in un POST valido vengono ignorati", isUpdate: false, expectValid: true, payload: { Name: "Catan", MinPlayer: "3", MaxPlayer: "4", MinAge: "10", Time: "120", Location: "A.1.2", CampoInutile: "Test" } }
];

let testsPassed = 0;
let testsFailed = 0;

testCases.forEach((test, index) => {
    let result;
    let cleanedPayload = test.payload;

    try {//SIMULIAMO IL CONTROLLER:
        cleanedPayload = cleanGameData({ ...test.payload }); 
        result = validateGame(cleanedPayload, test.isUpdate);
    } catch (error) {
        result = { valid: false, message: error.message };
    }

    const testNumber = String(index + 1).padStart(2, '0');
    console.log(`Test ${testNumber} result`, result);
    if (result.valid === test.expectValid) {
        console.log(`✅ Test ${testNumber} PASSATO | ${test.description}`);
        testsPassed++;
    } else {
        console.log(`❌ Test ${testNumber} FALLITO | ${test.description}`);
        console.log(`   -> Payload Inviato:`, cleanedPayload);
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