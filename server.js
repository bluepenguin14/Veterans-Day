const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3000;

const ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD || "ChangeMe123";

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
  const {
  name,
  tickets = 1
} = req.body;

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
  tickets,
  timestamp: new Date()
});

  saveData(data);

  res.json({ success: true });
});

app.post("/api/admin-add", (req, res) => {

  if (req.headers.password !== ADMIN_PASSWORD) {
    return res.status(401).json({
      error: "Unauthorized"
    });
  }

  const { name, tickets } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({
      error: "Name required"
    });
  }

  const data = loadData();

const ticketCount = parseInt(tickets) || 1;

data.entries.push({
  id: uuidv4(),
  name: name.trim(),
  tickets: ticketCount,
  timestamp: new Date()
});

saveData(data);

res.json({
  success: true
});
  }

  saveData(data);

  res.json({
    success: true
  });

});

app.get("/api/entries", (req, res) => {
  if (req.headers.password !== ADMIN_PASSWORD) {
    return res.status(401).send();
  }

  res.json(loadData().entries);
});

app.post("/api/admin-enter", (req, res) => {

  if (req.headers.password !== ADMIN_PASSWORD) {
    return res.status(401).send();
  }

  const {
    name,
    tickets = 1
  } = req.body;

  if (!name) {
    return res.status(400).json({
      error: "Name required"
    });
  }

  const data = loadData();

const ticketCount = parseInt(req.body.tickets) || 1;

data.entries.push({
  id: uuidv4(),
  name: name.trim(),
  tickets: ticketCount,
  timestamp: new Date()
});

  saveData(data);

  res.json({
    success: true
  });
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

const previousWinnerIds =
  data.winners.map(w => w.id);

const eligibleEntries =
  data.entries.filter(
    e => !previousWinnerIds.includes(e.id)
  );

if (eligibleEntries.length === 0) {
  return res.status(400).json({
    error: "No eligible entries remaining"
  });
}

// Calculate total tickets
const totalTickets =
  eligibleEntries.reduce(
    (sum, entry) =>
      sum + (parseInt(entry.tickets) || 1),
    0
  );

// Pick a random ticket
let randomTicket =
  Math.floor(Math.random() * totalTickets);

// Find the winner
let winner = null;

for (const entry of eligibleEntries) {

  randomTicket -=
    (parseInt(entry.tickets) || 1);

  if (randomTicket < 0) {
    winner = entry;
    break;
  }

}

data.winners.push({
  ...winner,
  drawTime: new Date()
});

saveData(data);

res.json(winner);

app.get("/api/winners", (req, res) => {
  if (req.headers.password !== ADMIN_PASSWORD) {
    return res.status(401).send();
  }

  res.json(loadData().winners);
});

app.post("/api/reset", (req, res) => {
  if (req.headers.password !== ADMIN_PASSWORD) {
    return res.status(401).send();
  }

  saveData({
    entries: [],
    winners: []
  });

  res.json({
    success: true
  });
});

app.get("/api/export-entries", (req, res) => {
  if (req.headers.password !== ADMIN_PASSWORD) {
    return res.status(401).send();
  }

  const entries = loadData().entries;

  let csv =
    "Name,Tickets,Timestamp\n";

  entries.forEach(entry => {
    csv += `"${entry.name}",${entry.tickets || 1},"${entry.timestamp}"\n`;
  });

  res.setHeader(
    "Content-Type",
    "text/csv"
  );

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=raffle-entries.csv"
  );

  res.send(csv);
});

app.listen(PORT, () =>
  console.log(`Running on port ${PORT}`)
);
