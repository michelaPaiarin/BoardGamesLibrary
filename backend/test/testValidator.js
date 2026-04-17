/**
 * Test suite for the game validator.
 * Run with: node test/testValidator.js
 * * Note: This test script was generated with AI assistance to stress-test 
 * the validation logic. While not part of the production server code, 
 * it is a crucial tool for the development and QA process.
 */

import { validateGame } from '../validators/games.js';

console.log("=========================================");
console.log("🚀 AVVIO SUITE DI TEST: VALIDATORE GIOCHI");
console.log("=========================================\n");

const testCases = [
    // --- TEST VALIDI (POST: Inserimento completo o minimo) ---
    {
        description: "POST Valida: Gioco perfetto e completo",
        isUpdate: false,
        expectValid: true,
        payload: {
            name: "Catan", bigImage: "https://example.com/catan.jpg", smallImage: "", 
            minPlayer: "3", maxPlayer: "4", time: "120", year: "1995", 
            location: "A.1.2", description: "Un gioco fantastico."
        }
    },
    {
        description: "POST Valida: Solo campi obbligatori",
        isUpdate: false,
        expectValid: true,
        payload: {
            name: "Scacchi", minPlayer: "2", maxPlayer: "2", time: "60", location: "B.3.4"
        }
    },

    // --- TEST VALIDI (PUT: Aggiornamenti parziali) ---
    {
        description: "PUT Valida: Aggiornamento di un solo campo (Tempo)",
        isUpdate: true,
        expectValid: true,
        payload: { time: "180" }
    },
    {
        description: "PUT Valida: Aggiornamento multiplo (Nome e Location)",
        isUpdate: true,
        expectValid: true,
        payload: { name: "Risiko Deluxe", location: "C.9.9" }
    },
    {
        description: "PUT Valida: Svuotamento campi opzionali (Stringhe vuote)",
        isUpdate: true,
        expectValid: true,
        payload: { bigImage: "", description: "" }
    },

    // --- TEST INVALIDI: CAMPI OBBLIGATORI E NOME ---
    {
        description: "POST Invalida: Manca il nome (Campo Obbligatorio)",
        isUpdate: false,
        expectValid: false,
        payload: { minPlayer: "2", maxPlayer: "4", time: "60", location: "C.3.3" }
    },
    {
        description: "POST Invalida: Nome formato da soli spazi",
        isUpdate: false,
        expectValid: false,
        payload: { name: "   ", minPlayer: "2", maxPlayer: "4", time: "60", location: "C.3.3" }
    },
    {
        description: "PUT Invalida: Nome inviato come Numero",
        isUpdate: true,
        expectValid: false,
        payload: { name: 12345 }
    },

    // --- TEST INVALIDI: GIOCATORI ---
    {
        description: "PUT Invalida: minPlayer non è un numero",
        isUpdate: true,
        expectValid: false,
        payload: { minPlayer: "due" }
    },
    {
        description: "POST Invalida: minPlayer è zero o negativo",
        isUpdate: false,
        expectValid: false,
        payload: { name: "Test", minPlayer: "-1", maxPlayer: "4", time: "60", location: "C.3.3" }
    },
    {
        description: "POST Invalida: minPlayer maggiore di maxPlayer",
        isUpdate: false,
        expectValid: false,
        payload: { name: "Test", minPlayer: "6", maxPlayer: "2", time: "60", location: "C.3.3" }
    },

    // --- TEST INVALIDI: TEMPO E ANNO ---
    {
        description: "PUT Invalida: Tempo negativo",
        isUpdate: true,
        expectValid: false,
        payload: { time: "-30" }
    },
    {
        description: "PUT Invalida: Anno troppo vecchio (es. prima del 1900)",
        isUpdate: true,
        expectValid: false,
        payload: { year: "1850" }
    },
    {
        description: "PUT Invalida: Anno nel futuro (es. 3000)",
        isUpdate: true,
        expectValid: false,
        payload: { year: "3000" }
    },

    // --- TEST INVALIDI: LOCATION (Regex) ---
    {
        description: "PUT Invalida: Location senza punti (es. A12)",
        isUpdate: true,
        expectValid: false,
        payload: { location: "A12" }
    },
    {
        description: "PUT Invalida: Location con lettere minuscole",
        isUpdate: true,
        expectValid: false,
        payload: { location: "a.1.2" }
    },
    {
        description: "PUT Invalida: Location testo a caso",
        isUpdate: true,
        expectValid: false,
        payload: { location: "Scaffale in alto" }
    },

    // --- TEST INVALIDI: IMMAGINI E URL ---
    {
        description: "PUT Invalida: URL Immagine senza http/https",
        isUpdate: true,
        expectValid: false,
        payload: { bigImage: "ftp://mio-server.com/img.jpg" }
    },
    {
        description: "PUT Invalida: URL Immagine con attacco XSS (Javascript)",
        isUpdate: true,
        expectValid: false,
        payload: { smallImage: "javascript:alert('Hackerato!')" }
    },
    {
        description: "PUT Invalida: URL Immagine non è una stringa ma un oggetto",
        isUpdate: true,
        expectValid: false,
        payload: { bigImage: { url: "http://test.com/img.jpg" } }
    }
];

let testsPassed = 0;
let testsFailed = 0;

testCases.forEach((test, index) => {
    const result = validateGame(test.payload, test.isUpdate);
    const testNumber = String(index + 1).padStart(2, '0'); // Formatta a 2 cifre: "01", "02"

    // Il test passa SE E SOLO SE il risultato corrisponde alle nostre aspettative
    if (result.valid === test.expectValid) {
        console.log(`✅ Test ${testNumber} PASSATO | ${test.description}`);
        testsPassed++;
    } else {
        console.log(`❌ Test ${testNumber} FALLITO | ${test.description}`);
        console.log(`   -> Aspettativa: valid = ${test.expectValid}`);
        console.log(`   -> Risultato: valid = ${result.valid}`);
        if (!result.valid) {
            console.log(`   -> Messaggio d'errore ricevuto: "${result.message}"`);
        }
        testsFailed++;
    }
});

console.log("\n=========================================");
console.log(`📊 RISULTATO FINALE: ${testsPassed}/${testCases.length} Test Passati`);
if (testsFailed === 0) {
    console.log("🏆 PERFETTO!");
} else {
    console.log("⚠️ Ci sono test da correggere nel validatore.");
}
console.log("=========================================\n");