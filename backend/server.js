import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const app = express();
const port = 3000;

app.use(express.static('../frontend'));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/welcome", (req, res) => {
  res.send("Welcome to the backend server of the Board Games Library!");
});

