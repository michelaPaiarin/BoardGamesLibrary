import express from 'express';

import gamesRouters from './routes/games.js';
import { connectDB, MODE } from './DB/database.js';
export { MODE }
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendPath = path.join(__dirname, '../frontend');
const sharedPath = path.join(__dirname, '../shared');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(frontendPath));
app.use('/shared', express.static(sharedPath));

export async function start(mode = MODE.DEFAULT) {
  try {
    await connectDB(mode);
    console.log('Database connected successfully');

    app.use('/games', gamesRouters);
    return app.listen(port, () => { console.log(`Server is running on port ${port}`); });
  } catch (error) {
    console.error('Error during startup:', error);
  }
}

if (process.argv[1] === __filename) {
  start();
}

app.get("/welcome", (req, res) => {
  res.send("Welcome to the backend server of the Board Games Library!");
});

