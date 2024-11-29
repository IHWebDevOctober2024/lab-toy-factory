const express = require("express");
const PORT = 5005;
require("dotenv").config();
const mongoose = require("mongoose");
const Toy = require("./models/Toy.model");
mongoose
  .connect(process.env.MONGODB_URI)
  .then((res) => {
    console.log(`Connected to the database ${res.connections[0].name}`);
  })
  .catch((error) => {
    console.error("Error connecting to the database", error);
  });

const app = express();
app.use(express.json());
app.get("/", (req, res) => {
  res.send("All good here!");
});
/*Iteration 3 | Create a Toy  */
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
    const response = await Toy.create(newToy);
    res.json(response);
  } catch (error) {
    console.log("Error creating a toy: ", error);
  }
});

/*Iteration 4 | Get All Toys */

app.get("/toys", async (req, res) => {
  try {
    const response = await Toy.find();
    res.json(response);
  } catch (error) {
    console.log("Error getting all toys: ", error);
  }
});

/*Iteration 5 | Get a Specific Toy by Name
MINI Bonus 1 | Case-insensitive Search no idea

*/

app.get("/toys/search", async (req, res) => {
  const { name } = req.query;
  // const regex = /^[a-zA-Z]+$/;

  // if (!name || !regex.test(name)) {
  //   return res.status(400).json({ error: "The name is not matching." });
  // }

  try {
    const response = await Toy.findOne({ name });
    res.json(response);
  } catch (error) {
    console.error("Error searching for a toy: ", error);
  }
});


//Aquiles solution for bonuses

// app.get("/toys/search", async (req, res) => {
//   const { name } = req.query;
//   try {
//     if (!name) {
//       const toys = await Toy.find();
//       return res.status(200).json(toys);
//     }
//     const toys = await Toy.find({
//       name: { $regex: name, $options: "i" },
//     });
//     if (toys.length === 0) {
//       return res.status(404).json({ message: "No toys found" });
//     }
//     res.status(200).json(toys);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });


/*Iteration 6 | Update a Toy */

app.put("/toys/:toyId", async (req, res) => {
  const { toyId } = req.params;
  const { name, description, quantity, price, inStock } = req.body;

  const updateToy = {
    name,
    description,
    quantity,
    price,
    inStock,
  };

  try {
    const response = await Toy.findByIdAndUpdate(toyId, updateToy);
    res.json(response);
  } catch (error) {
    console.error("Error updating a toy: ", error);
  }
});




app.listen(PORT, () => {
  console.log(`
    Server is running on port \x1b[33m${PORT}\x1b[0m
    Try a GET request to:
    \x1b[36mhttp://localhost:${PORT}/\x1b[0m
    `);
});
