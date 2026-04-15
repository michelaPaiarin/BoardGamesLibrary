import express from 'express';

const router = express.Router();

//Routes with prefix /games

router.get("/", (req, res) => {
  res.send("Qui ci sarà la lista dei tuoi giochi da tavolo!");
});

export default router;