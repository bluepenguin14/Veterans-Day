const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 3000;

const ADMIN_PASSWORD = "ChangeMe123";

app.use(bodyParser.json());
app.use(express.static("public"));

const dataFile = "./data/raffles.json";

function loadData() {
  if (!fs.existsSync(dataFile)) {
    return { entries: [], winners: [] };
  }
  return JSON.parse(fs.readFileSync(dataFile));
}

function saveData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

app.post("/api/enter", (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name required" });
  }

  const data = loadData();

  const exists = data.entries.some(
    e => e.name.toLowerCase() === name.toLowerCase()
  );

  if (exists) {
    return res.status(400).json({
      error: "Already entered"
    });
  }

  data.entries.push({
    id: uuidv4(),
    name,
    timestamp: new Date()
  });

  saveData(data);

  res.json({ success: true });
});

app.get("/api/entries", (req, res) => {
  if (req.headers.password !== ADMIN_PASSWORD) {
    return res.status(401).send();
  }

  res.json(loadData().entries);
});

app.post("/api/draw", (req, res) => {
  if (req.headers.password !== ADMIN_PASSWORD) {
    return res.status(401).send();
  }

  const data = loadData();

  if (data.entries.length === 0) {
    return res.status(400).json({
      error: "No entries"
    });
  }

  const winner =
    data.entries[
      Math.floor(Math.random() * data.entries.length)
    ];

  data.winners.push({
    ...winner,
    drawTime: new Date()
  });

  saveData(data);

  res.json(winner);
});

app.get("/api/winners", (req, res) => {
  if (req.headers.password !== ADMIN_PASSWORD) {
    return res.status(401).send();
  }

  res.json(loadData().winners);
});

app.listen(PORT, () =>
  console.log(`Running on port ${PORT}`)
);