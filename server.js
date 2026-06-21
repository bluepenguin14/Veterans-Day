const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Ticketless raffle = just a list of names
let entries = [];

// Enter raffle (no ticket system, just name)
app.post("/enter", (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ error: "Name required" });
  }

  entries.push(name.trim());

  res.json({
    message: "Entered raffle successfully",
    totalEntries: entries.length
  });
});

// Get entries
app.get("/entries", (req, res) => {
  res.json(entries);
});

// Pick winner randomly
app.get("/winner", (req, res) => {
  if (entries.length === 0) {
    return res.json({ error: "No entries yet" });
  }

  const winner = entries[Math.floor(Math.random() * entries.length)];

  res.json({ winner });
});

// Reset raffle (admin use)
app.post("/reset", (req, res) => {
  entries = [];
  res.json({ message: "Raffle reset complete" });
});

// IMPORTANT for Render deployment
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});