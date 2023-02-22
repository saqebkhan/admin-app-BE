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
  "mongodb+srv://saqebkhan:nRCwwfGKwbnFst4O@cluster0.mq3jsjx.mongodb.net/myData?retryWrites=true&w=majority";
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
});

const MyModel = mongoose.model("MyCollection", mySchema);

app.get("/myCollection", (req, res) => {
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

app.post("/myCollection", (req, res) => {
  const newItem = new MyModel(req.body);

  newItem.save((err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(newItem);
    }
  });
});

app.put("/myCollection/:id", (req, res) => {
  MyModel.findByIdAndUpdate(req.params.id, req.body, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(data);
    }
  });
});

app.delete("/myCollection/:id", (req, res) => {
  MyModel.findByIdAndRemove(req.params.id, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send({ message: "Item deleted" });
    }
  });
});
app.listen("https://admin-app-c353f.web.app", () => {
  console.log("listening at 5000");
});
