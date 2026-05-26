import sqlite3              from 'sqlite3';
import { open }             from 'sqlite';
import { readFile, access } from 'fs/promises';
import { fileURLToPath }    from 'url';
import path                 from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
 
const DB_PATH  = path.join(__dirname, 'games.db');
const SEED_DATA_SQL_PATH = path.join(__dirname, 'seedData.sql');

async function fileExists(filePath) {
    try   { await access(filePath); return true; }
    catch { return false; }
}

async function checkTableExists(db) {
    const row = await db.get(` SELECT name FROM sqlite_master 
                               WHERE type='table' AND name='Games'`);
    return row !== undefined; 
}

async function checkTableEmpty(db) {
    const row = await db.get(`SELECT COUNT(*) AS count FROM Games`);
    return row.count === 0;
}

async function initDB() {
    console.log('Seeding the BoardGamesLibrary database');

    if(!await fileExists(DB_PATH)) {
        console.error('Database file not found. Run "npm run init-db" first to initialize the database.');
        process.exit(1);
    }

    let db;
    try           { db = await open({ filename: DB_PATH, driver: sqlite3.Database });   }
    catch (error) { console.error('Error opening database:', error.message); process.exit(1);    }

    if(!await checkTableExists(db)) {
        console.error('Games table does not exist. Run "npm run init-db" first to initialize the database.');
        await db.close(); process.exit(1);
    }
    
    if(!await checkTableEmpty(db)) {
        console.log('The games table is not empty. Seeding aborted to prevent data loss.');
        await db.close(); process.exit(0);
    }

    let sql;
    try     { sql = await readFile(SEED_DATA_SQL_PATH, 'utf-8');    }
    catch   { console.error('File seedData.sql not found'); process.exit(1); }

    try { await db.exec(sql); await db.close();}
    catch (error) { console.error('Error seeding database:', error.message); process.exit(1); }
}
 
initDB().catch(err => { console.error('Unexpected error:', err); process.exit(1); });