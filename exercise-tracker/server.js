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
    const users = tracker.map(({ username, _id }) => ({ username, _id }));
    res.json(users);
  })
  .post((req, res) => {
    const { username } = req.body;
    const user = {
      username,
      _id: tracker.length,
      log: [],
    };
    tracker.push(user);

    res.json({
      username: user.username,
      _id: user._id,
    });
  });

app.post("/api/users/:_id/exercises", (req, res) => {
  const _id = parseInt(req.params._id, 10);
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

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
