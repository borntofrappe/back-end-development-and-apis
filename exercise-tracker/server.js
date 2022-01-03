const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");

const tracker = [];

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app
  .route("/api/users")
  .get((req, res) => {
    const users = tracker.map(({ _id, username }) => ({ _id, username }));
    res.json(users);
  })
  .post((req, res) => {
    const { username } = req.body;
    const user = {
      _id: tracker.length.toString(),
      username,
      log: [],
    };
    tracker.push(user);

    res.json({
      username: user.username,
      _id: user._id,
    });
  });

app.post("/api/users/:_id/exercises", (req, res) => {
  const { _id } = req.params;
  const { description, duration } = req.body;
  const date = req.body.date ? new Date(req.body.date) : new Date();

  const exercise = {
    description,
    duration: parseFloat(duration),
    date,
  };

  const user = tracker.find((d) => d._id === _id);
  user.log.push(exercise);

  res.json({
    _id,
    username: user.username,
    date: exercise.date.toDateString(),
    duration: exercise.duration,
    description: exercise.description,
  });
});

app.get("/api/users/:_id/logs", (req, res) => {
  const { to, from, limit } = req.query;

  const user = tracker.find(({ _id }) => _id === req.params._id);
  const { _id, username } = user;
  let log = [...user.log].sort((a, b) => b.date - a.date);

  if (to) {
    const date = new Date(to);
    log = log.filter((d) => d.date < date);
  }

  if (from) {
    const date = new Date(from);
    log = log.filter((d) => d.date > date);
  }

  if (limit) {
    log = log.slice(0, limit);
  }

  res.json({
    _id,
    username,
    count: log.length,
    log: log.map(({ description, duration, date }) => ({
      description,
      duration,
      date: date.toDateString(),
    })),
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
