import express from 'express';

import gamesRouters from './routes/games.js';
import { connectDB } from './DB/database.js';

import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendPath = path.join(__dirname, '../frontend');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(frontendPath));

async function start() {
  try {
    await connectDB();
    console.log('Database connected successfully');

    app.use('/games', gamesRouters);
    app.listen(port, () => { console.log(`Server is running on port ${port}`); });
  } catch (error) {
    console.error('Error during startup:', error);
  }
}

start();

app.get("/welcome", (req, res) => {
  res.send("Welcome to the backend server of the Board Games Library!");
});

