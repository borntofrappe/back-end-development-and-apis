# URL Shortener Microservice

Create an application similar [to the example URL Shortener Microservice](https://url-shortener-microservice.freecodecamp.rocks/).

## Links

- [Assignment](https://www.freecodecamp.org/learn/back-end-development-and-apis/back-end-development-and-apis-projects/url-shortener-microservice)

- [Solution](https://replit.com/@borntofrappe/boilerplate-project-urlshortener)

- [Solution without a database](https://replit.com/@borntofrappe/boilerplate-project-urlshortener-nodb)

## Notes

Unlike the first two projects for the back-end certification the URL shortener microservice requires a way to have data persist. It is possible to complete the assignment without relying on a database, and I describe how in a following section, but in order to practice with MongoDB and Mongoose — essential parts of the curriculum — the application is repurposed with a schema, model, documents and a database connection.

### NoDB

Without a database the script stores the data in an array.

```js
const shorturls = [];
```

This means that every time the script runs the collection of URLs is cleared. While the script is running, however, it is possible to refer to the data structure, populate and retrieve the items.

In the POST request you'd add the URL in its original version and short reference.

```js
shorturls.push({
  original_url: "www.google.com",
  short_url: 1,
});
```

In the GET request you'd look for a URL matching the short reference.

```js
// retrieve short_url
const shorturl = shorturls.find((d) => d.short_url === short_url);
```

### POST

For the POST method the goal is to retrieve the data from the request' body.

```js
app.post("/api/shorturl", function (req, res) {
  const url = req.body.url
}
```

To populate the object remember to initialize the `body-parser` module and set up the appropriate middleware, _before_ the app route itself.

```js
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));

// app.post()
```

To check for a valid URL the `dns` core module offers the `dns.lookup` function, accepting as input a hostname. The second argument is a callback function which potentially describes a error. Without an error the URL is presumed to be valid.

```js
dns.lookup(hostname, (err) => {
  if (!err) {
    // continue
  }
});
```

It is first necessary to find the hostname from the input URL. This is retrieved removing the `http://` or `https://` prefix and anything past the hostname, the portion describing the relative path.

```js
const hostname = url.replace(/http[s]?\:\/\//, "").replace(/\/(.+)?/, "");
```

When there is no hostname, or when the URL is not valid, return a JSON object describing the situation.

```js
res.json({
  error: "Invalid URL",
});
```

When the URL is valid, consider yet another fork in the road depending on whether the URL already exist in the stored collection.

Without a database, and relying on the array, look for the existing URL with the `.find` function.

```js
const shorturl = shorturls.find((d) => d.original_url === url);
```

If the value exist, return a JSON object describing the value and its short reference.

```js
const { original_url, short_url } = shorturl;
res.json({
  original_url,
  short_url,
});
```

If the URL is not already stored, create a new entry. Add a new URL giving the short reference the integer value describing the length of the array.

```js
const shorturl = {
  original_url: url,
  short_url: shorturls.length,
};
```

Once again, remove a JSON object with the desired fields.

```js
res.json(shorturl);
```

### GET

For the GET method begin by extracting the short reference from the route parameter.

```js
app.get("/api/shorturl/:short_url", function (req, res) {}
```

Since the reference is supposed to an integer immediately parse the parameter with `parseInt`. This makes it possible to have the integer or `NaN` in the moment the value is a string.

```js
const short_url = parseInt(req.params.short_url, 10);
if (short_url !== NaN) {
  // continue
}
```

When `NaN` return an appropriate error message.

```js
res.json({
  error: "Wrong format",
});
```

With an integer look for a URL in the array with a matching reference.

```js
const shorturl = shorturls.find((d) => d.short_url === short_url);
```

With a match redirect to the original URL directly through the `res.redirect` function.

```js
res.redirect(shorturl.original_url);
```

Without a match return a JSON object highlighting the situation.

```js
res.json({
  error: "No short URL found for the given input",
});
```

### Database

With the inclusion of MongoDB and Mongoose the idea is to have data persist in a database. With a database and a cluster on MongoDB Atlas establish a connection storing the URI in a secret `.env` file.

```.env
MONGO_URI=mongodb+srv://...
```

Pass the value through the `process` global in the first argument of `mongoose.connect`.

```js
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
```

Since `mongoose.connect` creates a promise you can chain the logic of the express application in a `.then` function.

```js
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true }).then(() => {
  app.listen(port, function () {
    console.log(`Listening on port ${port}`);
  });
});
```

In this manner the application listen on the prescribed port only when a connection is indeed established.

With a valid connection the idea is to replace the logic of the NoDB section, storing and retrieving items in an array, with mongoose queries. As a setup, begin by creating a schema with the values expected by a URL.

```js
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
```

Based on the schema create the model used as a mold for any document, for any URL created with the POST request.

```js
const Url = mongoose.model("Url", urlSchema);
```

With this information mongoose is already able to complete the application.

With the GET method, instead of looking for the data in the array with `.find`, look for a document with a matching short reference through the model and the `findOne` query.

```js
Url.findOne(
  {
    short_url,
  },
  (err, data) => {}
);
```

The code becomes increasingly indented as you consider both the error of the query, an error in the connection, and the presence of actual data. With a document redirect toward the original URL.

```js
if (data) {
  res.redirect(data.original_url);
}
```

Without a match prompt the same error message used for the NoDB section.

With the POST method begin once more by looking for a document with the `findOne` query. Instead of a URL with a specific short reference, however, look for a URL with a specific link.

```js
Url.findOne(
  {
    original_url: url,
  },
  (err, data) => {}
);
```

With a match return the JSON object describing the existing entry. Without a correspondence the idea is to create a document and save it, but it's first necessary to count the number of existing documents to create the short reference. A first solution is to retrieve all documents and use the `length` of the collection.

```js
Url.find({}, (err, data) => {
  console.log(data.length);
});
```

However, mongoose has a query fit for the purpose in `estimatedDocumentCount`.

```js
Url.estimatedDocumentCount((err, count) => {
  console.log(count);
});
```

With the number of documents create an instance of the model.

```js
const urlDocument = new Url({
  original_url: url,
  short_url: count,
});
```

Save the document with the `save` query.

```js
urlDocument.save((err, data) => {
  if (!err) {
    console.log("success!");
  }
});
```
