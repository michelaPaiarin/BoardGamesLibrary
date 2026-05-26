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

async function checkTableExists(db) {
    const row = await db.get(` SELECT name FROM sqlite_master 
                               WHERE type='table' AND name='Games'`);
    return row !== undefined; 
}

async function initDB() {
    console.log('Initializing the BoardGamesLibrary database');
    let fileExisted = await fileExists(DB_PATH);

    let db;
    try           { db = await open({ filename: DB_PATH, driver: sqlite3.Database });   }
    catch (error) { console.error('Error opening database:', error.message); process.exit(1);    }

    if (fileExisted && await checkTableExists(db)) {
       console.log('The games.db file and Games table already exist. Initialization skipped to prevent data loss.');
       await db.close(); process.exit(0);
    }

    if(!fileExisted) { console.log('Creating a new games.db file in:', DB_PATH, ''); }

    let sql;
    try     { sql = await readFile(CREATE_TABLE_SQL_PATH, 'utf-8');             }
    catch   { console.error('File createTable.sql not found'); process.exit(1); }
    
    const safeSql = sql.replace( /CREATE TABLE(\s+)/i, 'CREATE TABLE IF NOT EXISTS$1' );
    
    try           { await db.exec(safeSql); await db.close();                               }
    catch (error) { console.error('Error creating table:', error.message); process.exit(1); }
 
    console.log('Database initialized successfully');
}
 
initDB().catch(err => { console.error('Unexpected error:', err); process.exit(1); });