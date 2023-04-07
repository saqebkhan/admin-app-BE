const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
mongoose.set("strictQuery", false);

const cors = require("cors");
app.use(bodyParser.json());

// app.use(cors());

const corsOptions = {
  origin: "*",
};
const port = 5000
app.use(cors(corsOptions));
const uri =
  "mongodb+srv://saqebkhan:VIwFLSTpNevWMTk6@cluster0.601godh.mongodb.net/sample_mflix?retryWrites=true&w=majority";
// const uri = 'mongodb+srv://<username>:<password>@<cluster-address>/<database-name>?retryWrites=true&w=majority';

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB Atlas", err);
  });

const mySchema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  text: String,
  date: Date,
});

const MyModel = mongoose.model("Comments", mySchema);

app.get("/comments", (req, res) => {
  const page = parseInt(req.query.page) || 1; // Parse the requested page number from the query string, default to 1 if not specified
  const perPage = parseInt(req.query.perPage) || 10; // Parse the number of items per page from the query string, default to 10 if not specified

  MyModel.countDocuments({}, (err, count) => { // Get the total number of items in the collection
    if (err) {
      res.status(500).send(err);
    } else {
      const totalPages = Math.ceil(count / perPage); // Calculate the total number of pages based on the number of items per page and total number of items

      MyModel.find({}).skip((page - 1) * perPage).limit(perPage).exec((err, data) => { // Get the data for the requested page
        if (err) {
          res.status(500).send(err);
        } else {
          res.send({
            data,
            totalPages,
            currentPage: page,
            perPage,
          });
        }
      });
    }
  });
});
app.get("/allcomments", (req, res) => {
    // const data = new MyModel.find();
    console.log("res");
    // res.status(200).json({
    //   data,
    //   message: "success",
    // });
    MyModel.find({}, (err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        console.log(data, "data")
        res.send(data);
      }
    });
  });

app.post("/comments", (req, res) => {
  const newItem = new MyModel(req.body);

  newItem.save((err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(newItem);
    }
  });
});

app.put("/comments/:id", (req, res) => {
  MyModel.findByIdAndUpdate(req.params.id, req.body, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(data);
    }
  });
});

app.delete("/comments/:id", (req, res) => {
  MyModel.findByIdAndRemove(req.params.id, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send({ message: "Item deleted" });
    }
  });
});
app.listen(5000, () => {
  console.log("listening at 5000");
});