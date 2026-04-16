import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const dbRoute = 'games.db';

let DB = null;

export async function connectDB() {
    try {
        DB = await open({
          filename: dbRoute,
          driver: sqlite3.Database
        });

    
        console.log('Database initialized successfully');
    }catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;
    }
}

export function getDB() {
    if (DB) {
        return DB;
    } else {
        throw new Error('Database connection not established. Please call connectDB() first.');
    }
}