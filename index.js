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

app.use(cors(corsOptions));
const uri =
  // "mongodb+srv://saqebkhan:nRCwwfGKwbnFst4O@cluster0.mq3jsjx.mongodb.net/myData?retryWrites=true&w=majority";
  "mongodb+srv://saqebk619:TIeKTdjkzVzdktgW@cluster0.kqq13.mongodb.net/task-management-database?retryWrites=true&w=majority";
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
  userId: String,
  title: String,
  description: String,
  deadline: String,
  priority: String,
  stage: Number,
});

const MyModel = mongoose.model("tasks", mySchema);

app.get("/tasks", (req, res) => {
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
      console.log(data, "data");
      res.send(data);
    }
  });
});

app.get("/tasks/:id", (req, res) => {
  const taskId = req.params.id;
  MyModel.findById(taskId, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else if (!data) {
      res.status(404).send({ message: "Task not found" });
    } else {
      res.send(data);
    }
  });
});
app.post("/tasks", (req, res) => {
  const { userId, title } = req.body;

  // Check if a task with the same title already exists for the current user
  MyModel.findOne({ userId: userId, title: title }, (err, existingTask) => {
    if (err) {
      return res.status(500).send(err);
    }
    // If a task with the same title exists for the current user, send an error message
    if (existingTask) {
      return res
        .status(400)
        .send({ message: "A task with this title already exists for your user." });
    }
    // If no task with the same title, create and save the new task
    const newItem = new MyModel(req.body);
    newItem.save((err) => {
      if (err) {
        return res.status(500).send(err);
      } else {
        return res.send(newItem);
      }
    });
  });
});

app.put("/tasks/:id", (req, res) => {
  const { userId, title } = req.body;
  const taskId = req.params.id;

  // Check if a task with the same title already exists for the current user, excluding the current task
  MyModel.findOne(
    { userId: userId, title: title, _id: { $ne: taskId } },
    (err, existingTask) => {
      if (err) {
        return res.status(500).send(err);
      }
      // If a task with the same title exists for the current user, send an error message
      if (existingTask) {
        return res
          .status(400)
          .send({ message: "A task with this title already exists for your user." });
      }

      // If no duplicate title, update the task
      MyModel.findByIdAndUpdate(
        taskId,
        req.body,
        { new: true },
        (err, updatedTask) => {
          if (err) {
            return res.status(500).send(err);
          }
          if (!updatedTask) {
            return res.status(404).send({ message: "Task not found" });
          }
          return res.send(updatedTask);
        }
      );
    }
  );
});

app.delete("/tasks/:id", (req, res) => {
  MyModel.findByIdAndRemove(req.params.id, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send({ message: "Item deleted" });
    }
  });
});
const port = 3000;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
