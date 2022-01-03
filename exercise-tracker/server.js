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
      _id: Math.random(),
    };
    tracker.push(user);

    res.json(user);
  });

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
