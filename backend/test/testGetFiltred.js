/**
 * Questa suite esegue un collaudo end-to-end del motore di ricerca del backend,
 * verificando l'integrità del Query Builder dinamico, dei filtri virtuali
 * e del sistema di validazione isomorfa.
 * 
 * Copertura Test (81 Test Cases superati):
 * 1. SETUP & TEARDOWN: Inserimento e pulizia automatica (Safe-mode) dei dati di mock.
 * 2. ROTTE BASE: Gestione 'GET /games' e 'GET /games/:id' (inclusi ID non validi/inesistenti).
 * 3. FILTRI TESTUALI: Ricerche esatte (_e) e parziali (_c) su Name e Location.
 * 4. FILTRI NUMERICI: Uguaglianze ed estrazione per range (<, >, <=, >=) su Time, Age, Year.
 * 5. CAMPI VIRTUALI: Astrazione logica della UX tradotta in SQL dinamico: 'Player', 'Room', 'Age'
 * 6. FILTRI MISTI: Combinazione simultanea di testo, numeri e campi virtuali.
 * 7. PROTEZIONE E SICUREZZA (Errori 400): Intercettazione di tipi errati e blocco di operatori in conflitto
 * 8. EDGE CASES: Gestione di parametri sconosciuti (ignorati in sicurezza) e campi vuoti.
 * 
 * Nota:
 * Questo specifico file di test è stato generato e strutturato dall'Intelligenza Artificiale.
 * Trattandosi di uno script di collaudo ad uso  interno e non facente parte della logica di business
 * o dell'architettura del progetto, l'AI è stata impiegata per automatizzare e velocizzare 
 * la stesura degli 81 casi di test e la formattazione dell'output.
 */

import { start, MODE } from '../server.js'; 

const BASE = 'http://localhost:3000';
let server;
let passed = 0;
let failed = 0;

// Utility per i colori in console
const c = {
    reset: '\x1b[0m', green: '\x1b[32m', red: '\x1b[31m', 
    yellow: '\x1b[33m', cyan: '\x1b[36m', bold: '\x1b[1m', dim: '\x1b[2m'
};

async function req(method, path, body) {
    const opts = { method, headers: { 'Content-Type': 'application/json' } };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(`${BASE}${path}`, opts);
    let json = null;
    try { json = await res.json(); } catch (_) {}
    return { status: res.status, body: json };
}

function expect(label, actualStatus, expectedStatus, condition = true, detail = '') {
    if (actualStatus === expectedStatus && condition) {
        console.log(`  ✅ ${c.green}PASS${c.reset} | ${label} ${c.dim}${detail}${c.reset}`);
        passed++;
    } else {
        console.log(`  ❌ ${c.red}FAIL${c.reset} | ${label} (Expected ${expectedStatus}, Got ${actualStatus}) ${detail}`);
        failed++;
    }
}

function section(title) {
    console.log(`\n${c.yellow}▶ ${title}${c.reset}`);
}

// ─────────────────────────────────────────────
// DATI DI TEST TEMPORANEI
// ─────────────────────────────────────────────
const testGames = [
    { Name: "Catan",          Time: 120, MinPlayer: 3, MaxPlayer: 4,  MinAge: 10, Location: "A.1.1", Year: 1995 },
    { Name: "Catan: Marinai", Time: 90,  MinPlayer: 3, MaxPlayer: 4,  MinAge: 10, Location: "A.1.2", Year: 1997 },
    { Name: "Ticket to Ride", Time: 60,  MinPlayer: 2, MaxPlayer: 5,  MinAge: 8,  Location: "B.1.1", Year: 2004 },
    { Name: "Gloomhaven",     Time: 180, MinPlayer: 1, MaxPlayer: 4,  MinAge: 14, Location: "C.1.1", Year: 2017 },
    { Name: "Dixit",          Time: 30,  MinPlayer: 3, MaxPlayer: 6,  MinAge: 8,  Location: "D.1.1", Year: 2008 },
];
let insertedIds = [];

// ─────────────────────────────────────────────
// ESECUZIONE TEST
// ─────────────────────────────────────────────
async function runTests() {
    console.log(`\n${c.bold}${c.cyan}==================================================================${c.reset}`);
    console.log(`${c.bold}${c.cyan}🚀  MEGA-SUITE TEST: ROTTE GET (RICERCA E FILTRI)${c.reset}`);
    console.log(`${c.bold}${c.cyan}==================================================================${c.reset}\n`);

    server = await start(MODE.TEST);

    // ══════════════════════════════════════════════════════════════
    // FASE 0 — PRE-CLEANUP
    // ══════════════════════════════════════════════════════════════
    section("FASE 0: PRE-CLEANUP (rimozione giochi test residui)");
    for (const game of testGames) {
        const r = await req('GET', `/games?Name_e=${encodeURIComponent(game.Name)}`);
        if (r.body?.length > 0) await req('DELETE', `/games/${r.body[0].ID}`);
    }

    // ══════════════════════════════════════════════════════════════
    // FASE 1 — SETUP
    // ══════════════════════════════════════════════════════════════
    section("FASE 1: SETUP (Inserimento giochi di test)");
    for (const game of testGames) {
        const r = await req('POST', '/games', game);
        if (r.status === 201) insertedIds.push(r.body.gameId ?? r.body.id ?? r.body.ID);
    }
    console.log(`  Inseriti ${insertedIds.length}/5 giochi temporanei.\n`);

    // ══════════════════════════════════════════════════════════════
    // FASE 2 — ROTTE BASE
    // ══════════════════════════════════════════════════════════════
    section("FASE 2: ROTTE BASE (GET ALL e GET BY ID)");

    let r = await req('GET', '/games');
    expect("GET /games senza filtri", r.status, 200, Array.isArray(r.body) && r.body.length >= 5);

    r = await req('GET', `/games/${insertedIds[0]}`);
    expect("GET /games/:id (id esistente)", r.status, 200, r.body?.Name === "Catan");

    r = await req('GET', '/games/99999999');
    expect("GET /games/:id (id inesistente)", r.status, 404);

    r = await req('GET', '/games/not-a-number');
    expect("GET /games/:id (id non numerico)", r.status, 400);

    r = await req('GET', '/games/0');
    expect("GET /games/:id (id zero)", r.status, 400);

    r = await req('GET', '/games/-1');
    expect("GET /games/:id (id negativo)", r.status, 400);

    // ══════════════════════════════════════════════════════════════
    // FASE 3 — FILTRI TESTUALI: Name
    // ══════════════════════════════════════════════════════════════
    section("FASE 3: FILTRI TESTUALI — Name");

    r = await req('GET', '/games?Name_e=Dixit');
    expect("Name_e esatto (Dixit)", r.status, 200, r.body?.length === 1 && r.body[0].Name === "Dixit", `(Trovati: ${r.body?.length})`);

    r = await req('GET', '/games?Name_e=Catan');
    expect("Name_e esatto (Catan, non Catan: Marinai)", r.status, 200, r.body?.length === 1 && r.body[0].Name === "Catan", `(Trovati: ${r.body?.length})`);

    r = await req('GET', '/games?Name_c=Catan');
    expect("Name_c parziale (Catan → 2 risultati)", r.status, 200, r.body?.length >= 2, `(Trovati: ${r.body?.length})`);

    r = await req('GET', '/games?Name_c=ticket');
    expect("Name_c case-insensitive (ticket → Ticket to Ride)", r.status, 200, r.body?.some(g => g.Name === "Ticket to Ride"), `(Trovati: ${r.body?.length})`);

    r = await req('GET', '/games?Name_c=GiocoInventato');
    expect("Name_c nessun risultato (array vuoto)", r.status, 200, Array.isArray(r.body) && r.body.length === 0);

    r = await req('GET', '/games?Name_e=catan');
    expect("Name_e case-sensitive o insensitive (catan)", r.status, 200);
    // Non asserisce lunghezza — dipende dall'implementazione, basta che risponda 200

    // ══════════════════════════════════════════════════════════════
    // FASE 4 — FILTRI TESTUALI: Location e Room
    // ══════════════════════════════════════════════════════════════
    section("FASE 4: FILTRI TESTUALI — Location e Room");

    r = await req('GET', '/games?Location_e=A.1.1');
    expect("Location_e esatto (A.1.1 → Catan)", r.status, 200, r.body?.some(g => g.Name === "Catan"), `(Trovati: ${r.body?.length})`);

    r = await req('GET', '/games?Location_c=A.1');
    expect("Location_c parziale (A.1 → Catan e Marinai)", r.status, 200, r.body?.length >= 2, `(Trovati: ${r.body?.length})`);

    r = await req('GET', '/games?Room_e=A');
    expect("Room_e (A → giochi in stanza A)", r.status, 200, r.body?.some(g => g.Name === "Catan"), `(Trovati: ${r.body?.length})`);

    r = await req('GET', '/games?Room_e=A');
    expect("Room_e (A → NON include giochi in stanza B)", r.status, 200, !r.body?.some(g => g.Name === "Ticket to Ride"));

    r = await req('GET', '/games?Room_c=B');
    expect("Room_c (B → Ticket to Ride in B.1.1)", r.status, 200, r.body?.some(g => g.Name === "Ticket to Ride"));

    r = await req('GET', '/games?Room_e=Z');
    expect("Room_e (Z → nessun risultato)", r.status, 200, Array.isArray(r.body) && r.body.length === 0);

    r = await req('GET', '/games?Room_e=');
    expect("Room_e stringa vuota (valida, tutti i giochi)", r.status, 200);

    r = await req('GET', '/games?Room_e=ab');
    expect("Room_e regex non valida (ab → 400)", r.status, 400);

    r = await req('GET', '/games?Room_e=1');
    expect("Room_e numero come stringa (non valida → 400)", r.status, 400);

    // ══════════════════════════════════════════════════════════════
    // FASE 5 — FILTRI NUMERICI: Time
    // ══════════════════════════════════════════════════════════════
    section("FASE 5: FILTRI NUMERICI — Time");

    r = await req('GET', '/games?Time_eq=60');
    expect("Time_eq=60 (Ticket to Ride)", r.status, 200, r.body?.some(g => g.Name === "Ticket to Ride"));

    r = await req('GET', '/games?Time_gt=90');
    expect("Time_gt=90 (>90 → Catan 120, Gloomhaven 180)", r.status, 200, r.body?.some(g => g.Name === "Catan") && r.body?.some(g => g.Name === "Gloomhaven"));

    r = await req('GET', '/games?Time_ge=90');
    expect("Time_ge=90 (>=90 → include Catan: Marinai a 90)", r.status, 200, r.body?.some(g => g.Name === "Catan: Marinai"));

    r = await req('GET', '/games?Time_lt=60');
    expect("Time_lt=60 (<60 → Dixit a 30)", r.status, 200, r.body?.some(g => g.Name === "Dixit") && !r.body?.some(g => g.Name === "Ticket to Ride"));

    r = await req('GET', '/games?Time_le=60');
    expect("Time_le=60 (<=60 → include Ticket to Ride a 60)", r.status, 200, r.body?.some(g => g.Name === "Ticket to Ride"));

    r = await req('GET', '/games?Time_gt=30&Time_le=90');
    expect("Time range (30 < Time <= 90 → Marinai, Ticket)", r.status, 200, r.body?.some(g => g.Name === "Catan: Marinai") && r.body?.some(g => g.Name === "Ticket to Ride") && !r.body?.some(g => g.Name === "Catan"));

    r = await req('GET', '/games?Time_ge=30&Time_lt=120');
    expect("Time range (30 <= Time < 120 → include Dixit, escludi Catan)", r.status, 200, r.body?.some(g => g.Name === "Dixit") && !r.body?.some(g => g.Name === "Catan"));

    // ══════════════════════════════════════════════════════════════
    // FASE 6 — FILTRI NUMERICI: MinPlayer e MaxPlayer
    // ══════════════════════════════════════════════════════════════
    section("FASE 6: FILTRI NUMERICI — MinPlayer e MaxPlayer");

    r = await req('GET', '/games?MinPlayer_eq=1');
    expect("MinPlayer_eq=1 (Gloomhaven)", r.status, 200, r.body?.some(g => g.Name === "Gloomhaven") && !r.body?.some(g => g.Name === "Catan"));

    r = await req('GET', '/games?MinPlayer_ge=3');
    expect("MinPlayer_ge=3 (Catan, Marinai, Dixit)", r.status, 200, r.body?.some(g => g.Name === "Catan") && !r.body?.some(g => g.Name === "Gloomhaven"));

    r = await req('GET', '/games?MaxPlayer_le=4');
    expect("MaxPlayer_le=4 (Catan, Marinai, Gloomhaven)", r.status, 200, r.body?.some(g => g.Name === "Gloomhaven") && !r.body?.some(g => g.Name === "Dixit"));

    r = await req('GET', '/games?MaxPlayer_gt=5');
    expect("MaxPlayer_gt=5 (Dixit a 6)", r.status, 200, r.body?.some(g => g.Name === "Dixit") && !r.body?.some(g => g.Name === "Catan"));

    r = await req('GET', '/games?MinPlayer_ge=2&MaxPlayer_le=5');
    expect("MinPlayer_ge=2 & MaxPlayer_le=5 (Ticket to Ride)", r.status, 200, r.body?.some(g => g.Name === "Ticket to Ride"));

    // ══════════════════════════════════════════════════════════════
    // FASE 7 — FILTRI NUMERICI: MinAge e Year
    // ══════════════════════════════════════════════════════════════
    section("FASE 7: FILTRI NUMERICI — MinAge e Year");

    r = await req('GET', '/games?MinAge_ge=14');
    expect("MinAge_ge=14 (Gloomhaven)", r.status, 200, r.body?.some(g => g.Name === "Gloomhaven") && !r.body?.some(g => g.Name === "Catan"));

    r = await req('GET', '/games?MinAge_le=8');
    expect("MinAge_le=8 (Ticket to Ride, Dixit)", r.status, 200, r.body?.some(g => g.Name === "Dixit") && !r.body?.some(g => g.Name === "Gloomhaven"));

    r = await req('GET', '/games?MinAge_gt=8&MinAge_lt=14');
    expect("MinAge range (8 < MinAge < 14 → Catan a 10)", r.status, 200, r.body?.some(g => g.Name === "Catan") && !r.body?.some(g => g.Name === "Gloomhaven"));

    r = await req('GET', '/games?Year_eq=1995');
    expect("Year_eq=1995 (Catan)", r.status, 200, r.body?.some(g => g.Name === "Catan"));

    r = await req('GET', '/games?Year_gt=2000');
    expect("Year_gt=2000 (Ticket, Gloomhaven, Dixit)", r.status, 200, r.body?.some(g => g.Name === "Ticket to Ride") && !r.body?.some(g => g.Name === "Catan"));

    r = await req('GET', '/games?Year_ge=1995&Year_le=2004');
    expect("Year range (1995-2004 → Catan, Marinai, Ticket)", r.status, 200, r.body?.some(g => g.Name === "Catan") && r.body?.some(g => g.Name === "Ticket to Ride") && !r.body?.some(g => g.Name === "Gloomhaven"));

    // ══════════════════════════════════════════════════════════════
    // FASE 8 — FILTRI VIRTUALI: Player e Age
    // ══════════════════════════════════════════════════════════════
    section("FASE 8: FILTRI VIRTUALI — Player e Age");

    r = await req('GET', '/games?Player_eq=4');
    expect("Player_eq=4 ...", r.status, 200, r.body?.some(g => g.Name === "Catan") && r.body?.some(g => g.Name === "Dixit"));

    r = await req('GET', '/games?Player_eq=1');
    expect("Player_eq=1 (solo Gloomhaven min=1)", r.status, 200, r.body?.some(g => g.Name === "Gloomhaven"));

    r = await req('GET', '/games?Player_ge=5');
    expect("Player_ge=5 (giochi con MaxPlayer>=5: Ticket, Dixit)", r.status, 200, r.body?.some(g => g.Name === "Dixit") && r.body?.some(g => g.Name === "Ticket to Ride"));

    r = await req('GET', '/games?Player_le=2');
    expect("Player_le=2 (giochi con MinPlayer<=2: Ticket, Gloomhaven)", r.status, 200, r.body?.some(g => g.Name === "Ticket to Ride") && r.body?.some(g => g.Name === "Gloomhaven"));

    r = await req('GET', '/games?Age_eq=10');
    expect("Age_eq=10 (giochi con MinAge<=10: Catan, Marinai, Ticket, Dixit)", r.status, 200, r.body?.some(g => g.Name === "Catan") && !r.body?.some(g => g.Name === "Gloomhaven"));

    r = await req('GET', '/games?Age_le=8');
    expect("Age_le=8 (giochi con MinAge<=8: Ticket, Dixit)", r.status, 200, r.body?.some(g => g.Name === "Dixit") && !r.body?.some(g => g.Name === "Catan"));

    // ══════════════════════════════════════════════════════════════
    // FASE 9 — FILTRI MISTI (testo + numeri)
    // ══════════════════════════════════════════════════════════════
    section("FASE 9: FILTRI MISTI (testo + numeri)");

    r = await req('GET', '/games?Name_c=Catan&Time_lt=100');
    expect("Name_c=Catan & Time_lt=100 (solo Marinai a 90)", r.status, 200, r.body?.length === 1 && r.body[0].Name === "Catan: Marinai");

    r = await req('GET', '/games?Room_e=A&Time_ge=90');
    expect("Room_e=A & Time_ge=90 (Catan e Marinai in stanza A con Time>=90)", r.status, 200, r.body?.some(g => g.Name === "Catan") && r.body?.some(g => g.Name === "Catan: Marinai"));

    r = await req('GET', '/games?Name_c=Catan&MinAge_le=10&MaxPlayer_ge=4');
    expect("Name_c=Catan & MinAge_le=10 & MaxPlayer_ge=4", r.status, 200, r.body?.some(g => g.Name === "Catan"));

    r = await req('GET', '/games?Room_e=D&Player_ge=3');
    expect("Room_e=D & Player_ge=3 (Dixit in D con MaxPlayer>=3)", r.status, 200, r.body?.some(g => g.Name === "Dixit"));

    r = await req('GET', '/games?Year_gt=2000&Time_lt=60&Player_ge=3');
    expect("Year>2000 & Time<60 & Player>=3 (Dixit 2008, 30min, max6)", r.status, 200, r.body?.some(g => g.Name === "Dixit"));

    r = await req('GET', '/games?Name_c=ticket&Year_gt=2000&MinAge_le=10');
    expect("Name_c=ticket & Year>2000 & MinAge<=10 (Ticket to Ride)", r.status, 200, r.body?.some(g => g.Name === "Ticket to Ride"));

    // ══════════════════════════════════════════════════════════════
    // FASE 10 — ERRORI 400: CONFLITTI TRA OPERATORI
    // ══════════════════════════════════════════════════════════════
    section("FASE 10: ERRORI 400 — Conflitti tra operatori");

    r = await req('GET', '/games?Name_c=A&Name_e=B');
    expect("Conflitto Name_c + Name_e → 400", r.status, 400);

    r = await req('GET', '/games?Location_c=A&Location_e=B.1.1');
    expect("Conflitto Location_c + Location_e → 400", r.status, 400);

    r = await req('GET', '/games?Room_c=A&Room_e=B');
    expect("Conflitto Room_c + Room_e → 400", r.status, 400);

    r = await req('GET', '/games?Time_eq=60&Time_gt=50');
    expect("Conflitto Time_eq + Time_gt → 400", r.status, 400);

    r = await req('GET', '/games?Time_eq=60&Time_lt=90');
    expect("Conflitto Time_eq + Time_lt → 400", r.status, 400);

    r = await req('GET', '/games?Time_eq=60&Time_ge=60');
    expect("Conflitto Time_eq + Time_ge → 400", r.status, 400);

    r = await req('GET', '/games?Time_eq=60&Time_le=60');
    expect("Conflitto Time_eq + Time_le → 400", r.status, 400);

    r = await req('GET', '/games?Time_ge=30&Time_gt=30');
    expect("Conflitto Time_ge + Time_gt → 400", r.status, 400);

    r = await req('GET', '/games?Time_le=90&Time_lt=90');
    expect("Conflitto Time_le + Time_lt → 400", r.status, 400);

    r = await req('GET', '/games?MinPlayer_eq=2&MinPlayer_ge=1');
    expect("Conflitto MinPlayer_eq + MinPlayer_ge → 400", r.status, 400);

    r = await req('GET', '/games?MaxPlayer_le=4&MaxPlayer_lt=5');
    expect("Conflitto MaxPlayer_le + MaxPlayer_lt → 400", r.status, 400);

    r = await req('GET', '/games?Player_ge=2&Player_gt=3');
    expect("Conflitto Player_ge + Player_gt → 400", r.status, 400);

    r = await req('GET', '/games?Age_le=12&Age_lt=10');
    expect("Conflitto Age_le + Age_lt → 400", r.status, 400);

    r = await req('GET', '/games?Year_eq=2010&Year_gt=2000');
    expect("Conflitto Year_eq + Year_gt → 400", r.status, 400);

    // ══════════════════════════════════════════════════════════════
    // FASE 11 — ERRORI 400: TIPI ERRATI
    // ══════════════════════════════════════════════════════════════
    section("FASE 11: ERRORI 400 — Tipi errati");

    r = await req('GET', '/games?Time_eq=sessanta');
    expect("Time_eq stringa non numerica → 400", r.status, 400);

    r = await req('GET', '/games?Time_gt=test');
    expect("Time_gt stringa → 400", r.status, 400);

    r = await req('GET', '/games?MinPlayer_ge=due');
    expect("MinPlayer_ge stringa → 400", r.status, 400);

    r = await req('GET', '/games?MaxPlayer_lt=true');
    expect("MaxPlayer_lt booleano come stringa → 400", r.status, 400);

    r = await req('GET', '/games?Year_le=abc');
    expect("Year_le non numerico → 400", r.status, 400);

    r = await req('GET', '/games?Player_eq=quattro');
    expect("Player_eq stringa → 400", r.status, 400);

    r = await req('GET', '/games?Age_ge=old');
    expect("Age_ge stringa → 400", r.status, 400);

    // ══════════════════════════════════════════════════════════════
    // FASE 12 — CAMPI SCONOSCIUTI E CASI LIMITE
    // ══════════════════════════════════════════════════════════════
    section("FASE 12: CAMPI SCONOSCIUTI E CASI LIMITE");

    r = await req('GET', '/games?HackerField_eq=1');
    expect("Campo sconosciuto isolato (ignorato → 200)", r.status, 200);

    r = await req('GET', '/games?foo_c=bar');
    expect("Campo sconosciuto _c isolato (ignorato → 200)", r.status, 200);

    r = await req('GET', '/games?Name_c=Catan&HackerField_eq=1');
    expect("Campo valido + campo sconosciuto (ignorato → 200)", r.status, 200, r.body?.some(g => g.Name === "Catan"));

    r = await req('GET', '/games?Name_c=Catan&Name_e=Pesce&HackerField_eq=1');
    expect("Conflitto Name_c + Name_e con campo sconosciuto → 400", r.status, 400);

    r = await req('GET', '/games?Time_gt=30&Time_lt=30');
    expect("Range impossibile Time_gt=30 & Time_lt=30 (sintatticamente valido → 200, 0 risultati)", r.status, 200, Array.isArray(r.body) && r.body.length === 0);

    r = await req('GET', '/games?Name_c=');
    expect("Name_c stringa vuota (valida → 200, tutti)", r.status, 200, Array.isArray(r.body) && r.body.length >= 5);

    r = await req('GET', '/games?Name_e=');
    expect("Name_e stringa vuota (valida → 200, nessun risultato)", r.status, 200);

    r = await req('GET', '/games?Room_e=a');
    expect("Room_e minuscola (regex non valida → 400)", r.status, 400);

    r = await req('GET', '/games?Room_e=AB');
    expect("Room_e due lettere (regex non valida → 400)", r.status, 400);

    // ══════════════════════════════════════════════════════════════
    // FASE 13 — TEARDOWN
    // ══════════════════════════════════════════════════════════════
    section("FASE 13: TEARDOWN E PULIZIA DB");
    let deleted = 0;
    for (const id of insertedIds) {
        const d = await req('DELETE', `/games/${id}`);
        if (d.status === 200 || d.status === 204) deleted++;
    }
    console.log(`  Cancellati ${deleted}/${insertedIds.length} giochi temporanei.`);

    // ══════════════════════════════════════════════════════════════
    // RISULTATI FINALI
    // ══════════════════════════════════════════════════════════════
    const total = passed + failed;
    console.log(`\n${c.bold}==================================================================${c.reset}`);
    console.log(`  📊 RISULTATI FINALI`);
    console.log(`  Totale  : ${total}`);
    console.log(`  ${c.green}✅ Passati: ${passed}${c.reset}`);
    console.log(`  ${c.red}❌ Falliti: ${failed}${c.reset}`);
    console.log(`${c.bold}==================================================================${c.reset}`);
    if (failed === 0) {
        console.log(`\n  🎉 TUTTI I TEST PASSATI! LE ROTTE SONO BLINDATE! 🎉\n`);
    }

    server.close(() => process.exit(failed > 0 ? 1 : 0));
}

runTests().catch(err => {
    console.error(`\n${c.red}💥 CRASH DEL SERVER DI TEST:${c.reset}`, err);
    process.exit(1);
});