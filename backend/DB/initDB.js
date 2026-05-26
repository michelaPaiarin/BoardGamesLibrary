import sqlite3              from 'sqlite3';
import { open }             from 'sqlite';
import { readFile, access } from 'fs/promises';
import { fileURLToPath }    from 'url';
import path                 from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
 
const DB_PATH  = path.join(__dirname, 'games.db');
const CREATE_TABLE_SQL_PATH = path.join(__dirname, 'createTable.sql');

async function fileExists(filePath) {
    try   { await access(filePath); return true; }
    catch { return false; }
}

async function initDB() {
    console.log('Initializing the BoardGamesLibrary database');
 
    let sql;
    try     { sql = await readFile(CREATE_TABLE_SQL_PATH, 'utf-8');             }
    catch   { console.error('File createTable.sql not found'); process.exit(1); }
 
    
    const safeSql = sql.replace( /CREATE TABLE(\s+)/i, 'CREATE TABLE IF NOT EXISTS$1' );
 
    const dbAlreadyExisted = await fileExists(DB_PATH);
 
    if (dbAlreadyExisted) { console.log('The games.db file already exists. Table will not be overwritten.'); }
    else                  { console.log('Creating a new games.db file in:', DB_PATH, '');                    }
 
    let db;
    try {
        db = await open({ filename: DB_PATH, driver: sqlite3.Database });
        await db.exec(safeSql); await db.close();
    } catch (error) { console.error('Error creating table:', error.message); process.exit(1); }
 
    if (dbAlreadyExisted) {
        console.log('The games table is present.');
    } else {
        console.log('Database initialized successfully! Games table created.');
        console.log('Start server with: npm start');
    }
}
 
initDB().catch(err => { console.error('Unexpected error:', err); process.exit(1); });