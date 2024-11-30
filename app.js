const express = require("express");
const PORT = 5005;
require("dotenv").config();
const mongoose = require("mongoose");
const Toy = require("./models/Toy.model");

const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then((connection) => {
    console.log("connected to the database: ", connection.connection.name);
  })
  .catch((err) => {
    console.log("there was an error connecting", err);
  });

app.get("/", (req, res) => {
  res.send("All good here!");
});

app.post("/toys", async (req, res) => {
  const { name, description, quantity, price, inStock } = req.body;

  const newToy = {
    name,
    description,
    quantity,
    price,
    inStock,
  };

  try {
    const toy = await Toy.create(newToy);
    res.status(201).json(toy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/toys", async (req, res) => {
  try {
    const toys = await Toy.find({});
    res.status(200).json(toys);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/toys/search", async (req, res) => {
  try {
    const { name } = req.query;
    const searchedToy = await Toy.find({
      name: { $regex: name, $options: "i" },
    });
    res.status(200).json(searchedToy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put("/toys/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, quantity, price, inStock } = req.body;

  try {
    const updatedToy = await Toy.findByIdAndUpdate(id, req.body, { new: true });
    res.status(204).json(updatedToy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`
    Server is running on port \x1b[33m${PORT}\x1b[0m
    Try a GET request to:
    \x1b[36mhttp://localhost:${PORT}/\x1b[0m
    `);
});
