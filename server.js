const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const cors = require("cors");
const bodyParser = require("body-parser");
const ObjectID = require("mongodb").ObjectId;
const { MongoClient } = require("mongodb");

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  app.use(
    cors({
      methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    })
  );
  next();
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const connectToMongoDB = async () => {
  const client = new MongoClient("mongodb://127.0.0.1:27017", {
    useUnifiedTopology: true,
  });

  try {
    await client.connect();

    const db = client.db("my-crud-app");
    const productsCollection = db.collection("products");

    return {
      productsCollection,
    };
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    throw error;
  }
};

app.get("/products", async (req, res) => {
  try {
    const { productsCollection } = await connectToMongoDB();
    const data = await productsCollection.find({}).toArray();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving data", error });
  }
});

app.post("/products", upload.single("image"), async (req, res) => {
  try {
    const { productsCollection } = await connectToMongoDB();
    const newData = {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      image: req.file.filename,
    };
    const result = await productsCollection.insertOne(newData);
    res.json(newData);
  } catch (error) {
    res.status(500).json({ message: "Error inserting data", error });
  }
});

app.put("/products/:id", upload.single("image"), async (req, res) => {
  try {
    const { productsCollection } = await connectToMongoDB();
    const id = new ObjectID(req.params.id);
    const product = await productsCollection.findOne({ _id: id });

    const updateData = {
      $set: {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
      },
    };

    // Check if a new image is uploaded
    if (req.file) {
      updateData.$set.image = req.file.filename;

      // Delete the old image file
      const imagePath = `uploads/${product.image}`;
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting old image file", err);
        } else {
          console.log("Old image file deleted successfully");
        }
      });
    }

    const result = await productsCollection.updateOne({ _id: id }, updateData);

    if (result.modifiedCount === 1) {
      res.json(updateData.$set);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating data", error });
  }
});

app.delete("/products/:id", async (req, res) => {
  try {
    const { productsCollection } = await connectToMongoDB();
    const id = new ObjectID(req.params.id);
    const product = await productsCollection.findOne({ _id: id });
    const result = await productsCollection.deleteOne({ _id: id });

    if (result.deletedCount === 1) {
      const imagePath = `uploads/${product.image}`;
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image file", err);
        } else {
          console.log("Image file deleted successfully");
        }
      });

      res.json({ message: "Product deleted successfully" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting data", error });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
