import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const MODE = {DEFAULT:  "default", TEST: "test"};

const dbRoute = path.join(__dirname, 'games.db');
const testDbRoute = path.join(__dirname, 'test_games.db');
let DB = null;

export async function connectDB(mode = MODE.DEFAULT) {
    try {
        DB = await open({
          filename: mode === MODE.DEFAULT ? dbRoute : testDbRoute,
          driver: sqlite3.Database
        });

        console.log(`Database initialized successfully in ${mode} mode`);
    }catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;
    }
}

export function getDB() {
    if (DB) { return DB;}
    else    { throw new Error('Database connection not established. Please call connectDB() first.');}
}