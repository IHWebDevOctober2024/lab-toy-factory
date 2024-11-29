const express = require("express");
const mongoose = require("mongoose");
const Toy = require("./models/Toy.model.js");

const PORT = 5005;

require("dotenv").config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("All good here!");
});

app.get("/toys", async (req, res) => {
  try {
    const toys = await Toy.find();
    res.status(200).json(toys);
  } catch (err) {
    res.status(500).json({ message: "there's been an error retrieving toys" });
  }
});

app.get("/toys/:id", async (req, res) => {
  const { id } = req.params; //the solution is not like this one

  try {
    const oneToy = await Toy.findById(id);
    res.status(200).json(oneToy);
  } catch (err) {
    res
      .status(500)
      .json({ message: "there's been an error retrieving one toy" });
  }
});

app.put("/toys/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, quantity, price, inStock } = req.body;
  try {
    const updateToy = await Toy.findByIdAndUpdate(
      id,
      { name, description, quantity, price, inStock },
      { new: true }
    );
    res.status(200).json(updateToy);
  } catch (err) {
    res.status(500).json({ message: "there's been an error updating one toy" });
  }
});

app.post("/toys", (req, res) => {
  const { name, description, quantity, price, inStock, created } = req.body;

  const newToy = {
    name,
    description,
    quantity,
    price,
    inStock,
    created,
  };

  Toy.create(newToy)
    .then((createdToy) => {
      console.log("Toy created", createdToy);
      res.status(201).json(createdToy);
    })
    .catch((err) => {
      console.log("There's been an error creating the toy", err);
      res.status(500).json({ error: "failed to create the toy" });
    });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.log("Error connecting to database", err);
  });

app.listen(PORT, () => {
  console.log(`
    Server is running on port \x1b[33m${PORT}\x1b[0m
    Try a GET request to:
    \x1b[36mhttp://localhost:${PORT}/\x1b[0m
    `);
});
