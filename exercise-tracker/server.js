const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.use(bodyParser.urlencoded({ extended: false }));

const exerciseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: new Date(),
  },
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  log: {
    type: [exerciseSchema],
    default: [],
  },
});

const Exercise = mongoose.model("Exercise", exerciseSchema);
const User = mongoose.model("User", userSchema);

app
  .route("/api/users")
  .get((req, res) => {
    User.find({})
      .select("username")
      .exec((err, data) => {
        if (err) {
          res.json({ err });
        } else {
          res.json(data);
        }
      });
  })
  .post((req, res) => {
    const { username } = req.body;

    const user = new User({
      username,
    });

    user.save((err, data) => {
      if (err) {
        res.json({ err });
      } else {
        const { _id, username } = data;
        res.json({
          username,
          _id,
        });
      }
    });
  });

app.post("/api/users/:_id/exercises", (req, res) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body;

  const exercise = new Exercise({
    description,
    duration: parseFloat(duration),
    date: date || undefined,
  });

  User.findById(_id, (err, data) => {
    if (err) {
      res.json({ err });
    } else {
      data.log.push(exercise);
      data.save((err, data) => {
        if (err) {
          res.json({ err });
        } else {
          const { _id, username } = data;
          const { date, duration, description } = data.log[data.log.length - 1];
          res.json({
            _id,
            username,
            date: date.toDateString(),
            duration,
            description,
          });
        }
      });
    }
  });
});

app.get("/api/users/:_id/logs", (req, res) => {
  const { _id } = req.params;
  const { to, from, limit } = req.query;

  User.findById(_id, (err, data) => {
    if (err) {
      res.json({ err });
    } else {
      let log = [...data.log].sort((a, b) => b.date - a.date);

      if (from) {
        log = log.filter((d) => d.date > new Date(from));
      }

      if (to) {
        log = log.filter((d) => d.date < new Date(to));
      }

      if (limit) {
        log = log.slice(0, limit);
      }

      const { _id, username } = data;

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
    }
  });
});

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    const listener = app.listen(process.env.PORT || 3000, () => {
      console.log("Your app is listening on port " + listener.address().port);
    });
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
