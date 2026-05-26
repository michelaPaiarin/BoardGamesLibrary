import { start, MODE } from '../server.js';

// ─────────────────────────────────────────────
//  UTILITIES
// ─────────────────────────────────────────────

const BASE = 'http://localhost:3000';
let server;
let passed = 0;
let failed = 0;
const results = [];

const colors = {
  reset:  '\x1b[0m',
  green:  '\x1b[32m',
  red:    '\x1b[31m',
  yellow: '\x1b[33m',
  cyan:   '\x1b[36m',
  bold:   '\x1b[1m',
  dim:    '\x1b[2m',
  blue:   '\x1b[34m',
  magenta:'\x1b[35m',
};

const c = (color, text) => `${colors[color]}${text}${colors.reset}`;

function section(title) {
  console.log('\n' + c('blue', '━'.repeat(60)));
  console.log(c('bold', c('cyan', `  📦 ${title}`)));
  console.log(c('blue', '━'.repeat(60)));
}

function log(label, status, detail = '') {
  const icon   = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️ ';
  const color  = status === 'PASS' ? 'green' : status === 'FAIL' ? 'red' : 'yellow';
  const line   = `  ${icon}  ${c(color, status.padEnd(4))}  ${label}`;
  const extra  = detail ? c('dim', `\n         ${detail}`) : '';
  console.log(line + extra);
  if (status === 'PASS') passed++;
  else if (status === 'FAIL') failed++;
  results.push({ label, status, detail });
}

async function req(method, path, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body !== undefined) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${path}`, opts);
  let json = null;
  try { json = await res.json(); } catch (_) {}
  return { status: res.status, body: json };
}

function expect(label, actual, expected, detail = '') {
  if (actual === expected) {
    log(label, 'PASS', detail || `status ${actual}`);
    return true;
  } else {
    log(label, 'FAIL', `expected ${expected}, got ${actual}  ${detail}`);
    return false;
  }
}

// ─────────────────────────────────────────────
//  VALID GAME FIXTURES
// ─────────────────────────────────────────────

const validGame = () => ({
  Name:        'Catan',
  MinPlayer:   2,
  MaxPlayer:   4,
  MinAge:      10,
  Time:        90,
  Location:    'A.1.2',
  Description: 'Classic resource-trading board game.',
  UrlBigImage:  'https://example.com/catan-big.jpg',
  UrlSmallImage:'https://example.com/catan-small.jpg',
  Year:        1995,
});

const validGame2 = () => ({
  Name:      'Ticket to Ride',
  MinPlayer: 2,
  MaxPlayer: 5,
  MinAge:    8,
  Time:      60,
  Location:  'B.2.3',
});

const validGame3 = () => ({
  Name:      'Pandemic',
  MinPlayer: 2,
  MaxPlayer: 4,
  MinAge:    8,
  Time:      45,
  Location:  'C.1.1',
  Year:      2008,
});

// ─────────────────────────────────────────────
//  TEST RUNNER
// ─────────────────────────────────────────────

async function run() {
  console.log('\n' + c('bold', c('magenta', '╔══════════════════════════════════════════════════════════╗')));
  console.log(       c('bold', c('magenta', '║        🎲  BOARD GAMES API — STRESS TEST SUITE          ║')));
  console.log(       c('bold', c('magenta', '╚══════════════════════════════════════════════════════════╝')));
  console.log(c('dim', `  Started: ${new Date().toISOString()}\n`));

  server = await start(MODE.TEST);


  // ── 2. GET ALL GAMES (empty DB) ───────────────────────────
  section('2 · GET /games — empty database');
  {
    const r = await req('GET', '/games');
    expect('GET /games on empty DB → 200 or 204', r.status, 200, JSON.stringify(r.body)?.slice(0,80))
      || expect('GET /games on empty DB → 204', r.status, 204);
  }

  // ── 3. POST — VALID CREATIONS ─────────────────────────────
  section('3 · POST /games — valid creations');
  const createdIds = [];

  for (const [i, game] of [validGame(), validGame2(), validGame3()].entries()) {
    const r = await req('POST', '/games', game);
    const ok = expect(`POST valid game #${i+1} (${game.Name}) → 201`, r.status, 201, `id=${r.body?.id ?? r.body?._id ?? '?'}`);
    if (ok && r.body) {
      const id = r.body.gameId ?? r.body.id ?? r.body._id ?? r.body.ID;
      if (id !== undefined) createdIds.push(id);
    }
  }

  // ── 4. GET ALL GAMES (populated) ──────────────────────────
  section('4 · GET /games — after inserts');
  {
    const r = await req('GET', '/games');
    expect('GET /games → 200', r.status, 200, `count=${Array.isArray(r.body) ? r.body.length : '?'}`);
  }

  // ── 5. GET BY ID ──────────────────────────────────────────
  section('5 · GET /games/:id');
  if (createdIds.length > 0) {
    const r = await req('GET', `/games/${createdIds[0]}`);
    expect(`GET /games/${createdIds[0]} → 200`, r.status, 200, `name=${r.body?.Name ?? r.body?.name ?? '?'}`);
  } else {
    log('GET /games/:id', 'WARN', 'No IDs captured from POST — skipping');
  }
  // Non-existent ID
  {
    const r = await req('GET', '/games/999999');
    expect('GET /games/999999 → 404', r.status, 404);
  }
  // Invalid ID format
  {
    const r = await req('GET', '/games/not-a-valid-id');
    expect('GET /games/not-a-valid-id → 400 or 404', r.status === 400 || r.status === 404, true, `got ${r.status}`);
  }

  // ── 6. GET WITH QUERY FILTERS ─────────────────────────────
  section('6 · GET /games?key=value — query filters');
  {
    const r = await req('GET', '/games?MinPlayer=2');
    expect('GET /games?MinPlayer=2 → 200', r.status, 200);
  }
  {
    const r = await req('GET', '/games?MaxPlayer=4&MinAge=8');
    expect('GET /games?MaxPlayer=4&MinAge=8 → 200', r.status, 200);
  }
  {
    const r = await req('GET', '/games?Name=Catan');
    expect('GET /games?Name=Catan → 200', r.status, 200, `count=${Array.isArray(r.body) ? r.body.length : '?'}`);
  }
  {
    const r = await req('GET', '/games?Name=XYZNONEXISTENT');
    expect('GET /games?Name=XYZNONEXISTENT → 200 empty or 404', r.status === 200 || r.status === 404, true, `got ${r.status}`);
  }
  {
    const r = await req('GET', '/games?InvalidField=foo');
    expect('GET /games?InvalidField=foo → 400 or 200', r.status === 400 || r.status === 200, true, `got ${r.status}`);
  }

  // ── 7. POST — MISSING REQUIRED FIELDS ────────────────────
  section('7 · POST /games — missing required fields');
  const requiredFields = ['Name', 'MinPlayer', 'MaxPlayer', 'Time', 'Location', 'MinAge'];
  for (const field of requiredFields) {
    const game = validGame();
    delete game[field];
    const r = await req('POST', '/games', game);
    expect(`POST missing ${field} → 400`, r.status, 400, r.body?.error ?? r.body?.message ?? '');
  }

  // ── 8. POST — CONSTRAINT VIOLATIONS ──────────────────────
  section('8 · POST /games — constraint violations');
  const badCases = [
    { label: 'MinPlayer=0 (< 1)',           patch: { MinPlayer: 0 } },
    { label: 'MinPlayer=-5 (negative)',      patch: { MinPlayer: -5 } },
    { label: 'MaxPlayer < MinPlayer',        patch: { MinPlayer: 5, MaxPlayer: 2 } },
    { label: 'Time=0',                       patch: { Time: 0 } },
    { label: 'Time=-10',                     patch: { Time: -10 } },
    { label: 'MinAge=1 (< 2)',               patch: { MinAge: 1 } },
    { label: 'MinAge=0',                     patch: { MinAge: 0 } },
    { label: 'Year=1899 (< 1900)',           patch: { Year: 1899 } },
    { label: 'Year=0',                       patch: { Year: 0 } },
    { label: `Year=${new Date().getFullYear()+1} (future)`, patch: { Year: new Date().getFullYear() + 1 } },
    { label: 'Location wrong format "1.A.2"',patch: { Location: '1.A.2' } },
    { label: 'Location "a.1.2" (lowercase)', patch: { Location: 'a.1.2' } },
    { label: 'Location "A1.2" (no dots)',    patch: { Location: 'A12' } },
    { label: 'Location "" (empty)',          patch: { Location: '' } },
    { label: 'UrlBigImage invalid protocol', patch: { UrlBigImage: 'ftp://example.com/img.jpg' } },
    { label: 'UrlSmallImage not a URL',      patch: { UrlSmallImage: 'not-a-url' } },
    { label: 'Name="" (empty string)',       patch: { Name: '' } },
    { label: 'Name=null',                    patch: { Name: null } },
    { label: 'MinPlayer="two" (string)',     patch: { MinPlayer: 'two' } },
    { label: 'MaxPlayer="five" (string)',    patch: { MaxPlayer: 'five' } },
    { label: 'Empty body {}',               game: {} },
    { label: 'Completely wrong body',        game: { foo: 'bar', baz: 123 } },
  ];

  for (const { label, patch, game: overrideGame } of badCases) {
    const body = overrideGame ?? { ...validGame(), ...patch };
    const r = await req('POST', '/games', body);
    expect(`POST ${label} → 400`, r.status, 400, r.body?.error ?? r.body?.message ?? '');
  }

  // ── 9. POST — DUPLICATE NAME ──────────────────────────────
  section('9 · POST /games — duplicate Name conflict');
  {
    const r = await req('POST', '/games', validGame()); // Catan again
    expect('POST duplicate Name "Catan" → 409', r.status, 409, r.body?.error ?? r.body?.message ?? '');
  }

  // ── 10. PUT — VALID UPDATES ───────────────────────────────
  section('10 · PUT /games/:id — valid updates');
  if (createdIds.length > 0) {
    const id = createdIds[0];
    const r = await req('PUT', `/games/${id}`, { ...validGame(), Time: 120, Description: 'Updated description' });
    expect(`PUT /games/${id} → 200`, r.status, 200, `time=${r.body?.Time ?? '?'}`);
  } else {
    log('PUT valid update', 'WARN', 'No IDs captured — skipping');
  }

  // ── 11. PUT — PARTIAL UPDATE ──────────────────────────────
  section('11 · PUT /games/:id — partial / edge updates');
  if (createdIds.length > 0) {
    const id = createdIds[0];
    // Only required fields (strip optional)
    const minimal = { Name: 'Catan', MinPlayer: 2, MaxPlayer: 4, MinAge: 10, Time: 90, Location: 'A.1.2' };
    const r = await req('PUT', `/games/${id}`, minimal);
    expect(`PUT minimal required fields → 200`, r.status, 200);
  }

  // ── 12. PUT — CONSTRAINT VIOLATIONS ──────────────────────
  section('12 · PUT /games/:id — constraint violations');
  if (createdIds.length > 0) {
    const id = createdIds[0];
    const putBad = [
      { label: 'MaxPlayer < MinPlayer',      patch: { MinPlayer: 6, MaxPlayer: 2 } },
      { label: 'Time=0',                     patch: { Time: 0 } },
      { label: 'Location wrong format',      patch: { Location: 'wrong' } },
      { label: 'Year=1800',                  patch: { Year: 1800 } },
      { label: 'Name=null',                  patch: { Name: null } },
      { label: 'Empty body',                 game: {} },
    ];
    for (const { label, patch, game: g } of putBad) {
      const body = g ?? { ...validGame(), ...patch };
      const r = await req('PUT', `/games/${id}`, body);
      expect(`PUT ${label} → 400`, r.status, 400, r.body?.error ?? r.body?.message ?? '');
    }
  } else {
    log('PUT constraint violations', 'WARN', 'No IDs — skipping');
  }

  // ── 13. PUT — NON-EXISTENT / INVALID ID ───────────────────
  section('13 · PUT /games/:id — not found & bad id');
  {
    const r = await req('PUT', '/games/999999', validGame());
    expect('PUT /games/999999 → 404', r.status, 404);
  }
  {
    const r = await req('PUT', '/games/not-valid', validGame());
    expect('PUT /games/not-valid → 400 or 404', r.status === 400 || r.status === 404, true, `got ${r.status}`);
  }

  // ── 14. PUT — DUPLICATE NAME ──────────────────────────────
  section('14 · PUT /games/:id — duplicate Name conflict');
  if (createdIds.length >= 2) {
    // Try to rename game #2 to "Catan" which is already taken by #1
    const r = await req('PUT', `/games/${createdIds[1]}`, { ...validGame2(), Name: 'Catan' });
    expect('PUT rename to existing Name → 409', r.status, 409);
  } else {
    log('PUT duplicate name conflict', 'WARN', 'Need ≥2 IDs — skipping');
  }

  // ── 15. DELETE ────────────────────────────────────────────
  section('15 · DELETE /games/:id');
  // Delete non-existent
  {
    const r = await req('DELETE', '/games/999999');
    expect('DELETE /games/999999 → 404', r.status, 404);
  }
  // Delete invalid id
  {
    const r = await req('DELETE', '/games/bad-id');
    expect('DELETE /games/bad-id → 400 or 404', r.status === 400 || r.status === 404, true, `got ${r.status}`);
  }
  // Delete valid
  if (createdIds.length > 0) {
    const id = createdIds[createdIds.length - 1]; // delete last
    const r = await req('DELETE', `/games/${id}`);
    expect(`DELETE /games/${id} → 200 or 204`, r.status === 200 || r.status === 204, true, `got ${r.status}`);
    // Confirm it's gone
    const r2 = await req('GET', `/games/${id}`);
    expect(`GET deleted /games/${id} → 404`, r2.status, 404);
  }
  // Double delete
  if (createdIds.length > 0) {
    const id = createdIds[createdIds.length - 1];
    const r = await req('DELETE', `/games/${id}`);
    expect(`DELETE already-deleted /games/${id} → 404`, r.status, 404);
  }

  // ── 16. STRESS — CONCURRENT WRITES ────────────────────────
  section('16 · STRESS — 20 concurrent POSTs');
  {
    const promises = Array.from({ length: 20 }, (_, i) =>
      req('POST', '/games', {
        Name:      `StressGame_${i}`,
        MinPlayer: 2,
        MaxPlayer: Math.max(2, (i % 6) + 2),
        MinAge:    6 + (i % 5),
        Time:      30 + i * 3,
        Location:  `${String.fromCharCode(65 + (i % 5))}.${(i % 4) + 1}.${(i % 3) + 1}`,
        Year:      1980 + i,
      })
    );
    const results = await Promise.all(promises);
    const ok201  = results.filter(r => r.status === 201).length;
    const ok409  = results.filter(r => r.status === 409).length;
    const errors = results.filter(r => r.status !== 201 && r.status !== 409).length;
    log(`20 concurrent POSTs: ${ok201} created, ${ok409} conflict, ${errors} error`,
        errors === 0 ? 'PASS' : 'FAIL',
        `statuses: ${results.map(r => r.status).join(' ')}`);
    // collect new IDs
    for (const r of results) {
      if (r.status === 201 && r.body) {
        const id = r.body.id ?? r.body._id ?? r.body.ID ?? r.body.gameId;;
        if (id !== undefined) createdIds.push(id);
      }
    }
  }

  // ── 17. STRESS — RAPID GETs ───────────────────────────────
  section('17 · STRESS — 30 concurrent GETs');
  {
    const promises = Array.from({ length: 30 }, () => req('GET', '/games'));
    const res = await Promise.all(promises);
    const ok = res.filter(r => r.status === 200).length;
    log(`30 concurrent GETs: ${ok}/30 OK`, ok === 30 ? 'PASS' : 'FAIL');
  }

  // ── 18. STRESS — MIXED LOAD ───────────────────────────────
  section('18 · STRESS — mixed GET + POST + DELETE');
  {
    const mix = [
      ...Array.from({ length: 10 }, () => req('GET', '/games')),
      ...Array.from({ length: 5 },  (_, i) => req('POST', '/games', {
        Name:      `MixedStress_${i}`,
        MinPlayer: 1,
        MaxPlayer: 4,
        MinAge:    8,
        Time:      45,
        Location:  `D.${i+1}.1`,
      })),
      ...(createdIds.length > 0
        ? Array.from({ length: 3 }, (_, i) =>
            req('GET', `/games/${createdIds[i % createdIds.length]}`)
          )
        : []),
    ];
    const res = await Promise.all(mix);
    const ok  = res.filter(r => r.status >= 200 && r.status < 300).length;
    const bad = res.filter(r => r.status >= 500).length;
    log(`Mixed load ${mix.length} reqs: ${ok} success, ${bad} server errors`,
        bad === 0 ? 'PASS' : 'FAIL');
  }

  // ── 19. EDGE CASES ────────────────────────────────────────
  section('19 · EDGE CASES — boundary & exotic inputs');
  {
    // MaxPlayer === MinPlayer (valid boundary)
    const r = await req('POST', '/games', {
      Name: 'Solo Chess', MinPlayer: 1, MaxPlayer: 1, MinAge: 6, Time: 30, Location: 'E.1.1'
    });
    expect('POST MinPlayer=MaxPlayer=1 → 201', r.status, 201);
  }
  {
    // Year = current year (max allowed)
    const r = await req('POST', '/games', {
      Name: 'NewGame2025', MinPlayer: 2, MaxPlayer: 4, MinAge: 12, Time: 60,
      Location: 'F.1.1', Year: new Date().getFullYear()
    });
    expect(`POST Year=${new Date().getFullYear()} (max valid) → 201`, r.status, 201);
  }
  {
    // Year = 1900 (min allowed)
    const r = await req('POST', '/games', {
      Name: 'AncientGame1900', MinPlayer: 2, MaxPlayer: 4, MinAge: 10, Time: 60,
      Location: 'F.2.1', Year: 1900
    });
    expect('POST Year=1900 (min valid) → 201', r.status, 201);
  }
  {
    // Very long description
    const r = await req('POST', '/games', {
      Name: 'LongDescGame', MinPlayer: 2, MaxPlayer: 4, MinAge: 8, Time: 30,
      Location: 'G.1.1', Description: 'A'.repeat(5000)
    });
    expect('POST Description=5000 chars → 201 or 400', r.status === 201 || r.status === 400, true, `got ${r.status}`);
  }
  {
    // SQL/NoSQL injection attempt in Name
    const r = await req('POST', '/games', {
      Name: "'; DROP TABLE games; --", MinPlayer: 2, MaxPlayer: 4, MinAge: 8, Time: 30, Location: 'H.1.1'
    });
    expect('POST injection in Name → 400 or 201 (sanitized)', r.status === 400 || r.status === 201, true, `got ${r.status}`);
  }
  {
    // XSS in Description
    const r = await req('POST', '/games', {
      Name: 'XssGame', MinPlayer: 2, MaxPlayer: 4, MinAge: 8, Time: 30,
      Location: 'I.1.1', Description: '<script>alert("xss")</script>'
    });
    expect('POST XSS in Description → 201 or 400', r.status === 201 || r.status === 400, true, `got ${r.status}`);
  }
  {
    // Extra unknown fields
    const r = await req('POST', '/games', {
      ...validGame(), Name: 'ExtraFieldGame', Location: 'J.1.1', HackerField: 'evil', __proto__: { polluted: true }
    });
    expect('POST extra unknown fields → 201 or 400', r.status === 201 || r.status === 400, true, `got ${r.status}`);
  }
  {
    // No Content-Type (send raw string)
    const r = await fetch(`${BASE}/games`, { method: 'POST', body: 'plain text body' });
    expect('POST plain text body → 400', r.status, 400);
  }

  // ── 20. CLEANUP — DELETE ALL CREATED ─────────────────────
  section('20 · CLEANUP — delete all created games');
  {
    const allGames = await req('GET', '/games');
    const games = Array.isArray(allGames.body) ? allGames.body : [];
    let deleted = 0;
    for (const g of games) {
      const id = g.id ?? g._id ?? g.ID;
      if (id !== undefined) {
        const r = await req('DELETE', `/games/${id}`);
        if (r.status === 200 || r.status === 204) deleted++;
      }
    }
    const after = await req('GET', '/games');
    const remaining = Array.isArray(after.body) ? after.body.length : '?';
    log(`Deleted ${deleted}/${games.length} games, ${remaining} remaining`,
        remaining === 0 || remaining === '?' ? 'PASS' : 'WARN');
  }

  // ── SUMMARY ───────────────────────────────────────────────
  console.log('\n' + c('bold', c('magenta', '╔══════════════════════════════════════════════════════════╗')));
  console.log(       c('bold', c('magenta', '║                     📊  RESULTS                         ║')));
  console.log(       c('bold', c('magenta', '╚══════════════════════════════════════════════════════════╝')));
  console.log(`  ${c('green', `✅  PASSED : ${String(passed).padStart(3)}`)}   ${c('red', `❌  FAILED : ${String(failed).padStart(3)}`)}   Total: ${passed + failed}`);
  console.log(`  ${c('dim', `Finished: ${new Date().toISOString()}`)}`);

  if (failed > 0) {
    console.log('\n' + c('red', c('bold', '  Failed tests:')));
    results.filter(r => r.status === 'FAIL').forEach(r => {
      console.log(c('red', `    ✗ ${r.label}`) + (r.detail ? c('dim', ` — ${r.detail}`) : ''));
    });
  }
  console.log();

  server.close(() => process.exit(failed > 0 ? 1 : 0));
}

run().catch(err => {
  console.error(c('red', '\n💥 FATAL ERROR:'), err);
  process.exit(1);
});