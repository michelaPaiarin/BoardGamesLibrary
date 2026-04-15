import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

import gamesRouters from './routes/games.js';

const app = express();
const port = 3000;
const dbRoute = './DB/games.db';

app.use(express.static('../frontend'));

async function start() {
  try {
    const db = await open({
      filename: dbRoute,
      driver: sqlite3.Database
    });

    console.log('Database connected successfully');

    app.set('db', db);
    app.use('/games', gamesRouters);

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Error during startup:', error);
  }
}

start();

app.get("/welcome", (req, res) => {
  res.send("Welcome to the backend server of the Board Games Library!");
});

