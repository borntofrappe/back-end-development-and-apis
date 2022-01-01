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

### MongoDB and mongoose
