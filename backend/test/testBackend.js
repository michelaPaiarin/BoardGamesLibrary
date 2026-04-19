/**
 * ============================================================================
 * E2E API INTEGRATION TEST SUITE - Board Games Library
 * ============================================================================
 * Ambiente: Test Isocrono (Database test_games.db)
 * Scopo: Validazione completa dei flussi CRUD, gestione errori e 
 * sanitizzazione dei payload in ingresso.
 * ============================================================================
 */

import { start, MODE } from '../server.js';
import readline from 'readline';

const BASE_URL = 'http://localhost:3000/games';

// Configurazione dell'interfaccia interattiva per le pause
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askUserToContinue = (phaseMessage) => {
    return new Promise((resolve) => {
        console.log(`\n⏸️  PAUSA INTERATTIVA: ${phaseMessage}`);
        rl.question(`👉 Controlla il DB 'test_games.db', poi premi INVIO per continuare...`, () => {
            resolve();
        });
    });
};

let createdGameId = null; 
let testsPassed = 0;
let testsFailed = 0;

/**
 * Helper per la formattazione dei risultati del test e la stampa delle risposte
 */
async function assertTest(testName, expectedStatus, response) {
    const actualStatus = response.status;
    let responseData;
    
    try {
        responseData = await response.json();
    } catch {
        responseData = "Nessun corpo JSON nella risposta";
    }

    if (expectedStatus === actualStatus) {
        console.log(`✅ [PASS] ${testName} (Status: ${actualStatus})`);
        testsPassed++;
    } else {
        console.log(`❌ [FAIL] ${testName}`);
        console.log(`   -> Atteso: ${expectedStatus}, Ricevuto: ${actualStatus}`);
        testsFailed++;
    }
    // Stampa il dettaglio della risposta per ispezione
    console.log(`   📄 Risposta API:`, responseData);
    return responseData;
}

/**
 * Helper per eseguire chiamate HTTP semplificate
 */
async function makeRequest(method, endpoint, payload = null) {
    const options = { method, headers: { 'Content-Type': 'application/json' } };
    if (payload) options.body = JSON.stringify(payload);
    return await fetch(`${BASE_URL}${endpoint}`, options);
}

// ============================================================================
// ESECUZIONE DELLA TEST SUITE
// ============================================================================
async function runAdvancedSuite() {
    console.log("====================================================");
    console.log("🚀 AVVIO SUITE DI TEST E2E AVANZATA");
    console.log("====================================================\n");

    try {
        console.log("⚙️  Inizializzazione Server in modalità TEST...");
        const server = await start(MODE.TEST);
        
        // Attesa per garantire l'inizializzazione del driver SQLite
        await new Promise(resolve => setTimeout(resolve, 500));

        // ---------------------------------------------------------
        // FASE 1: LETTURA E CREAZIONE (GET & POST)
        // ---------------------------------------------------------
        console.log("\n--- FASE 1: LETTURA E INSERIMENTO DATI ---");
        
        let res = await makeRequest('GET', '/');
        await assertTest("GET /games -> Recupero lista iniziale giochi", 200, res);

        const uniqueGameName = `E2E Test Game - ${Date.now()}`;

        const payloadValido = {
            Name: uniqueGameName, MinPlayer: "1", MaxPlayer: "4", MinAge: "14", 
            Time: "120", Location: "A.1.1", Description: "Campagna E2E Test"
        };
        
        res = await makeRequest('POST', '/', payloadValido);
        const postData = await assertTest("POST /games -> Inserimento Gioco Valido", 201, res);
        
        // Estrazione ID (adattato in base al nome della chiave restituita dal tuo Model)
        createdGameId = postData.gameId || postData.id || postData.lastID;
        
        if (!createdGameId) {
            console.log("\n🛑 ABORTO FASI SUCCESSIVE: Impossibile recuperare l'ID del gioco creato.");
            console.log("   -> Causa probabile: Violazione vincolo UNIQUE o errore Server.");
            console.log("   -> Evito gli errori a cascata sulle rotte PUT e DELETE.");
            
            server.close();
            process.exit(1);
        }
        
        

        res = await makeRequest('POST', '/', { Name: "Scacchi" });
        await assertTest("POST /games -> Rifiuto per Campi Obbligatori Mancanti", 400, res);

        res = await makeRequest('POST', '/', { ...payloadValido, Time: [120] });
        await assertTest("POST /games -> Rifiuto per Type Checking Fallito (Time as Array)", 400, res);

        // PAUSA INTERATTIVA
        await askUserToContinue("Gioco creato. Verifica l'inserimento del record (Gloomhaven).");

        // ---------------------------------------------------------
        // FASE 2: LETTURA SPECIFICA E AGGIORNAMENTO (GET BY ID & PUT)
        // ---------------------------------------------------------
        console.log("\n--- FASE 2: RICERCA E AGGIORNAMENTO DATI ---");

        res = await makeRequest('GET', `/${createdGameId}`);
        await assertTest(`GET /games/${createdGameId} -> Recupero record specifico`, 200, res);

        res = await makeRequest('GET', `/999999`);
        await assertTest("GET /games/999999 -> Gestione Risorsa Non Trovata", 404, res);

        const payloadUpdate = { Time: "180", Description: "Durata aggiornata via E2E" };
        res = await makeRequest('PUT', `/${createdGameId}`, payloadUpdate);
        await assertTest(`PUT /games/${createdGameId} -> Aggiornamento campi parziali`, 200, res);

        res = await makeRequest('PUT', `/${createdGameId}`, { CampoNonEsistente: "Valore" });
        await assertTest(`PUT /games/${createdGameId} -> Rifiuto post-Sanitizzazione (Nessun campo valido)`, 400, res);

        res = await makeRequest('PUT', `/${createdGameId}`, { MinAge: { age: 10 } });
        await assertTest(`PUT /games/${createdGameId} -> Rifiuto per Type Checking (Oggetto invece di String/Number)`, 400, res);

        // PAUSA INTERATTIVA
        await askUserToContinue("Gioco aggiornato. Verifica che 'Time' sia 180 e la descrizione sia mutata.");

        // ---------------------------------------------------------
        // FASE 3: ELIMINAZIONE E VERIFICA (DELETE)
        // ---------------------------------------------------------
        console.log("\n--- FASE 3: RIMOZIONE DATI ---");

        res = await makeRequest('DELETE', `/${createdGameId}`);
        await assertTest(`DELETE /games/${createdGameId} -> Rimozione record`, 200, res);

        res = await makeRequest('GET', `/${createdGameId}`);
        await assertTest(`GET /games/${createdGameId} -> Verifica 404 post-rimozione`, 404, res);

        res = await makeRequest('DELETE', `/${createdGameId}`);
        await assertTest(`DELETE /games/${createdGameId} -> Gestione eliminazione record inesistente`, 404, res);

        // PAUSA INTERATTIVA FINALE
        await askUserToContinue("Gioco eliminato. Verifica che il DB test_games.db sia pulito.");

        // ---------------------------------------------------------
        // CHIUSURA E REPORT
        // ---------------------------------------------------------
        console.log("\n--- TEST CONCLUSI ---");
        
        server.close(() => {
            console.log("\n====================================================");
            console.log(`📊 REPORT FINALE E2E: ${testsPassed} PASSATI | ${testsFailed} FALLITI`);
            
            if (testsFailed === 0 && testsPassed > 0) {
                console.log("🏆 ARCHITETTURA BACKEND VALIDATA CON SUCCESSO.");
            } else {
                console.log("⚠️ RILEVATE ANOMALIE. Consultare i log precedenti.");
            }
            console.log("====================================================\n");
            
            rl.close(); // Chiude l'interfaccia interattiva
            process.exit(testsFailed === 0 ? 0 : 1);
        });

    } catch (error) {
        console.error("\n❌ ERRORE CRITICO DI SISTEMA:");
        console.error(error);
        rl.close();
        process.exit(1);
    }
}

// Avvio automatico della suite
runAdvancedSuite();