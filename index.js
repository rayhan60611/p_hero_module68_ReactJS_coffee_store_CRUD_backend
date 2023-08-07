const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Coffee store");
});

app.listen(port, () => {
  console.log(`Coffee store is running on port ${port}`);
});
