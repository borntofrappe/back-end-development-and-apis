// server.js
// where your node app starts

// init project
var express = require("express");
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

// /api/2015-12-12
// /api/1449878400000
app.get("/api/:date", function (req, res) {
  const date = new Date(req.params.date);
  if (date instanceof Date && !isNaN(date)) {
    res.json({
      unix: date.getTime(),
      utc: date.toGMTString(),
    });
  } else {
    const date = new Date(parseInt(req.params.date, 10));
    if (date instanceof Date && !isNaN(date)) {
      res.json({
        unix: date.getTime(),
        utc: date.toGMTString(),
      });
    } else {
      res.json({
        error: "Invalid Date",
      });
    }
  }
});

// /api
app.get("/api", function (req, res) {
  res.json({
    unix: new Date().getTime(),
    utc: new Date().toGMTString(),
  });
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
