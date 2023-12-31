const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Coffee store");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1t2lj4i.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // createing db and collection
    const database = client.db("coffeeStoreDB");
    const coffeeCollection = database.collection("coffee");

    // API start
    //Get all coffee API
    app.get("/coffee", async (req, res) => {
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //Get a single coffee API
    app.get("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      // Query for a movie that has the title 'The Room'
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    });

    //Post coffee API
    app.post("/coffee", async (req, res) => {
      const data = req.body;
      const result = await coffeeCollection.insertOne(data);
      res.send(result);
    });

    //PUT->Update coffee API
    app.put("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      // create a filter for a coffee to update
      const filter = { _id: new ObjectId(id) };
      // this option instructs the method to create a document if no documents match the filter
      const options = { upsert: true };
      // create a document that sets the plot of the movie
      const updateCoffee = {
        $set: {
          coffeeName: data.coffeeName,
          availableQuantity: data.availableQuantity,
          supplierName: data.supplierName,
          taste: data.taste,
          category: data.category,
          details: data.details,
          price: data.price,
          photoUrl: data.photoUrl,
        },
      };

      const result = await coffeeCollection.updateOne(
        filter,
        updateCoffee,
        options
      );
      res.send(result);
    });

    //delete coffee API
    app.delete("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      // Query for a movie that has title "Annie Hall"
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Coffee store is running on port ${port}`);
});
