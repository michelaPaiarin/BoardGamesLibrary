import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

import gamesRouters from './routes/games.js';

const app = express();
const port = 3000;

app.use(express.static('../frontend'));
app.use('/games', gamesRouters);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/welcome", (req, res) => {
  res.send("Welcome to the backend server of the Board Games Library!");
});

