require("dotenv").config();
const dns = require("dns");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const shorturls = [];

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

// POST /api/shorturl
// retrieve url_input from body of the request
app.post("/api/shorturl", function (req, res) {
  const url = req.body.url || "";
  const hostname = url.replace(/http[s]?\:\/\//, "").replace(/\/(.+)?/, "");

  if (hostname) {
    dns.lookup(hostname, (err) => {
      if (err) {
        res.json({
          error: "Invalid URL",
        });
      } else {
        const shorturl = shorturls.find((d) => d.original_url === url);
        if (shorturl) {
          const { original_url, short_url } = shorturl;
          res.json({
            original_url,
            short_url,
          });
        } else {
          const short_url = shorturls.length;
          const shorturl = {
            original_url: url,
            short_url,
          };
          shorturls.push(shorturl);
          res.json(shorturl);
        }
      }
    });
  } else {
    res.json({
      error: "Invalid URL",
    });
  }
});

// GET /api/shorturl/<shorturl>
// <shorturl>: integer
app.get("/api/shorturl/:short_url", function (req, res) {
  const short_url = parseInt(req.params.short_url, 10);
  if (short_url !== NaN) {
    const shorturl = shorturls.find((d) => d.short_url === short_url);

    if (shorturl) {
      res.redirect(shorturl.original_url);
    } else {
      res.json({
        error: "No short URL found for the given input",
      });
    }
  } else {
    res.json({
      error: "Wrong format",
    });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
