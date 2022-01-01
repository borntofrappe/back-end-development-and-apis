require("dotenv").config();
const dns = require("dns");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  original_url: {
    type: String,
    required: true,
  },
  short_url: {
    type: Number,
    required: true,
  },
});

const Url = mongoose.model("Url", urlSchema);

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
        Url.findOne(
          {
            original_url: url,
          },
          (err, data) => {
            if (err) {
              res.json({
                error: err,
              });
            } else {
              if (data) {
                const { original_url, short_url } = data;
                res.json({
                  original_url,
                  short_url,
                });
              } else {
                Url.find({}, (err, data) => {
                  if (err) {
                    res.json({
                      error: err,
                    });
                  } else {
                    const urlDocument = new Url({
                      original_url: url,
                      short_url: data.length,
                    });

                    urlDocument.save((err, data) => {
                      if (err) {
                        res.json({
                          error: err,
                        });
                      } else {
                        const { original_url, short_url } = data;
                        res.json({
                          original_url,
                          short_url,
                        });
                      }
                    });
                  }
                });
              }
            }
          }
        );
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
    Url.findOne(
      {
        short_url,
      },
      (err, data) => {
        if (err) {
          res.json({
            error: err,
          });
        } else {
          if (data) {
            res.redirect(data.original_url);
          } else {
            res.json({
              error: "No short URL found for the given input",
            });
          }
        }
      }
    );
  } else {
    res.json({
      error: "Wrong format",
    });
  }
});

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    app.listen(port, function () {
      console.log(`Listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
