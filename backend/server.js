const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, "frontend")));

// Startseite
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// Server starten
app.listen(PORT, () => {
  console.log('✅ Server läuft auf http://localhost:' + PORT);
});
