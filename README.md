# Back End Development and APIs

Notes and solutions to earn the [Back End Development and APIs](https://www.freecodecamp.org/learn/back-end-development-and-apis) certification on the freeCodeCamp curriculum.

## Projects

### [Timestamp Microservice](https://www.freecodecamp.org/learn/back-end-development-and-apis/back-end-development-and-apis-projects/timestamp-microservice)

### [Request Header Parser Microservice](https://www.freecodecamp.org/learn/back-end-development-and-apis/back-end-development-and-apis-projects/request-header-parser-microservice)

### [URL Shortener Microservice](https://www.freecodecamp.org/learn/back-end-development-and-apis/back-end-development-and-apis-projects/url-shortener-microservice)

### [Exercise Tracker](https://www.freecodecamp.org/learn/back-end-development-and-apis/back-end-development-and-apis-projects/exercise-tracker)

### [File Metadata Microservice](https://www.freecodecamp.org/learn/back-end-development-and-apis/back-end-development-and-apis-projects/file-metadata-microservice)

## Courses

### Managing Packages with NPM

[Link to REPL](https://replit.com/@borntofrappe/boilerplate-npm)

#### package file

`package.json` works as the entry point of the project, a JSON object of defining key-value pairs.

There are two required fields: `name` and `version`.

```json
{
  "name": "project",
  "version": "1.0.0"
}
```

Given the JSON syntax **use double quotes** and separate the fields with a comma.

Useful fields:

- `author`, who created the project, a string or object with further details such as name, address

- `description`, short informative description summarizing the project's goals

- `keywords`

- `license`, what users are allowed to do with the library. MIT and BSD popular for open source projects

- `version`, "1.0.0"

- `dependencies`, an object listing the packages used in the project and their respective version

#### Semantic versioning

npm packages follow _semantic versioning_, detailing with successive integers:

- major versions, breaking changes

- minor versions, backwards-compatible features

- patch versions, backwards-compatible fixes

Introduce the version with special characters to have npm benefit from higher versions:

- the tilde character `~` allows to install bug fixes, any `MAJOR.MINOR.X' version

- the caret character `^` points to bug fixes and minor updates, any `MAJOR.Y.X' version

To remove a package remove its mention from `dependencies`.

### Basic Node and Express

[Link to REPL](https://replit.com/@borntofrappe/boilerplate-express)

Node.js is a runtime to write back-end, server-side applications with JavaScript. Express is a package to handle server communication, requests and responses.

#### Express app

Through express set up a server:

```js
const express = require("express");
const app = express();
```

For a basic request and response cycle listen on a specific port.

```js
app.listen(3000);
```

_Please note:_ in the REPL freeCodeCamp already accounts for the listening portion in `server.js`.

#### Routes

Set up routes with the format `app.METHOD(PATH, HANDLER)`, where:

- method describes the supported request (GET, POST, PUT)

- path details the relative URL past the port number

- handler illustrates how to handle the request and response. Most practically it's a function receiving two objects, the request and response

```js
app.get("/", (req, res) => {
  res.send("Hello Express");
});
```

Use `res.send` to send a string.

Use `res.sendFile` to point toward a path, like a markup file.

```js
app.get('/', (req, res) => {
    res.sendFile(ABSOLUTE PATH);
})
```

For the path use the global `__dirname` to retrieve the position of the directory. From this starting point redirect toward the file in the desired folder.

```js
res.sendFile(`${__dirname}/views/index.html`);
```

#### Middleware

Serve static files, like images and stylesheets, with an express _middleware_.

```js
express.static(PATH);
```

The path points to the folder with the static files.

```js
express.static(`${__dirname}/public`);
```

Include the middleware through a call to `app.use(PATH, MIDDLEWARE)`. Here the path instructs where to use the middleware function. As per the challenge, the folder is included in a request to the `/public` route.

```js
app.use("/public", express.static(`${__dirname}/public`));
```

#### API

Beside string and static files the application as an API serves data. The goal is to build a REST API, meaning REpresentational State Transfer, exchanging data with a URL and an action.

```js
app.get("/json", (req, res) => {
  res.json({
    message: "Hello json",
  });
});
```

With the snippet the application sends a JSON object when receiving a GET request to the `/json` route.

#### Environmental variables

An `.env` file helps to store secrets and configuration options in a file which is not shared. The values themselves are available through `process.env.VALUE_NAME`.

Specify the keys with uppercase strings and the value past the assignment operator, withouth spaces.

```.env
MESSAGE_STYLE=uppercase
```

_Please note:_ in the REPL `.env` files are deprecated. Specify the key value pairs through the option in side bar devoted to "Secrets".

Locally install `dotenv` to have the variables in `process.env`.

```js
require("dotenv").config();
```

#### Middleware in detail

Looking in details at middleware functions these receive three arguments: the request, the response and the next function in the application.

```js
const middleware = (req, res, next) => {};
```

The idea is to generally use these functions to produce _side effects_, like adding data to the request or response. The middleware function is able to immediately terminate the process by sending a response.

```js
const middleware = (req, res, next) => {
  res.send("Middleware");
};
```

Alternatively, it allows to move to the following function in the stack by calling `next()`.

```js
const middleware = (req, res, next) => {
  res.message = "Hello middleware";
  next();
};
```

Set up the middleware with `app.use`

```js
app.use(middleware);
```

You can execute the function for different methods specifically.

```js
app.get(middleware);
app.post(middleware);
```

```js
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
};
```

With the snippet a request to any path logs the method and path. Be sure to include the middleware _before_ the routes on which the middleware is supposed to work.

```js
app.use(logger);

app.get(/**/);
```

Beside a specific method, the middleware can be included in specific routes.

```js
app.use("/path", logger);
```

The function can also be chained in route definitions, as the third argument.

```js
app.get(
  "/user",
  (req, res, next) => {
    req.message = "Hello middleware";
    next();
  },
  (req, res) => {
    res.send(req.message);
  }
);
```

```js
app.get(
  "/now",
  (req, res, next) => {
    req.time = new Date().toString();
    next();
  },
  (req, res) => {
    res.json({
      time: req.time,
    });
  }
);
```

With the snippet a request to `/now` will display the current time. The information is added to the request through a middleware chain.

#### Route parameters

Route parameters allow to retrieve data from the URL.

A request to `/user/John` for instance allows to retrieve the name of the user listening on a request to the `/user/:name` route.

```js
app.get("/user/:name", (req, res) => {
  const { name } = req.params;
  res.send(`Hello ${name}`);
});
```

The information is available in a `req.params` object.

```js
app.get("/:word/echo", (req, res) => {
  const { word } = req.params;
  res.json({
    echo: word,
  });
});
```

The snippet sends back the word included through the `echo` route.

Notice that the parameter doesn't have to be the last element in the URL.

#### Query parameters

Query parameters allow to retrieve data from the URL.

A request to `/user?name=John&age=32` for instance allows to retrieve the name and age by listening directly to the `/user` route.

The query is introduced with a question mark character `?`, the values are in a `key=value` format and separated by the ampersand character `&`.

```js
app.get("/user", (req, res) => {
  const { name, age } = req.query;
  res.send(`Hello ${name}`);
});
```

In the request the values are available in the `req.query` object.

```js
app.get("/name", (req, res) => {
  const { first, last } = req.query;
  res.json({
    name: `${first} ${last}`,
  });
});
```

The snippet snippet retrieves the first and last name to return a JSON object combining the two values.

#### Routes

In place of `app.METHOD(PATH)` use `app.route(PATH)` to handle multiple requests for the same route by chaining methods.

```js
app.route("/name").get(/* ... */).post(/* ... */);
```

Past the GET method, the POST method is used to send information and ultimately create data. The data is included in the body of the request, also known as _payload_.

To retrieve data in a urlencoded format begin by installing `body-parser`.

```json
{
  "dependencies": {
    "body-parser": "^1.15.2"
  }
}
```

In the script include the body parser with a middleware function.

```js
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));

// routes
```

The relevant function is `bodyParser.urlencoded()`. Setting `extended` to false means data is received only in string or array values.

To retrieve data handle the POST request with `app.post`.

```js
app
  .route("name")
  .get(/* get method */)
  .post((req, res) => {});
```

Access the data through `req.body`.

```js
const { first, last } = req.body;
```

In the snippet the request is handled with a simple response, sending the same JSON object of the get request. Here you'd handle creating the new user.

#### Methods

There are several methods which support several features:

- GET: read existing source

- POST: create a new resource

- PUT (PATCH): update an existing resource

- DELETE: remove resource

### MongoDB and Mongoose

[Link to REPL](https://replit.com/@borntofrappe/boilerplate-mongomongoose)

MongoDB is a database application storing JSON objects in a NoSQL database. There are no tables, like in a SQL databse, and data is stored in records, individual _documents_.

Mongoose is a utility to work with JavaScript objects and create _schemas_, blueprints describing the supported value and types.

#### Setup

Start by creating an account and database with MongoDB atlas [following this article](https://www.freecodecamp.org/news/get-started-with-mongodb-atlas/).

Once you created an account, a database, a cluster, a user who can read and update the data, the necessary IP address permissions, install mongodb and mongoose with specific versions.

```json
{
  "dependencies": {
    "mongodb": "~3.6.0",
    "mongoose": "~5.4.0"
  }
}
```

Add an environmental veriable `MONGO_URI` pointing to the database URI. The link is retrieved from the cluster selecting the _connect_ option.

In the script require mongoose and establish a connection through the URI.

```js
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
```

#### Mongoose basics

A schema describes the shape of the documents, and is the building block for models.

A model is what ultimately allows to create instances, documents.

The [quickstart guide](https://mongoosejs.com/docs/index.html) on the mongoose website describes the basic flow as follows:

1. create a schema specifying the accepted type and values

   ```js
   const personSchema = new mongoose.Schema({
     name: String,
   });
   ```

2. create a model from the schema

   ```js
   const Person = mongoose.model("Person", personSchema);
   ```

3. create documents, instances of the model

   ```js
   const person = new Person({
     name: "Gabriele",
   });
   ```

#### Callback

Mongoose operations accept as a last argument a callback function, itself receiving two arguments: `err` and `data`.

```js
Person.find(
  {
    name: "Gabriele",
  },
  (err, data) => {
    // handle data
  }
);
```

This is a common pattern in node.

_Please note:_ the challenges include a `done()` function to terminate the asynchronous operations. Include the error or data returned by the callback function to pass the tests.

```js
done(null, data); // success
done(err); // error
```

#### Schema

The challenge asks for a `personSchema` schema matching the following prototype.

```text
- Person Prototype -
--------------------
name : string [required]
age :  number
favoriteFoods : array of strings (*)
```

Use an object to further customize the values, in type, but also other attributes.

```js
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: Number,
  favoriteFoods: [String],
});
```

#### Crud

Create a person by referencing the schema.

```js
const person = new Person({
  name: "Gabriele",
  favoriteFoods: ["grapes", "carrots"],
});
```

Once created, save the document in the database through the `document.save()` method.

```js
person.save((err, data) => {
  if (err) {
    done(err);
  } else {
    done(null, data);
  }
});
```

_Please note:_ creating two objects with the same values has the effect of storing two separate documents.

It is possible to create individual documents and save the instances. `Model.create()` accepts an array of objects to create multiple instances.

```js
Person.create(
  [
    {
      name: "Timothy",
      age: 23,
    },
    {
      name: "Eliza",
      age: 33,
    },
  ],
  (err, data) => {}
);
```

#### cRud

Use `Model.find` to retrieve the documents matching the input object.

```js
Person.find(
  {
    name: "Gabriele",
  },
  (err, data) => {}
);
```

Use `Model.findOne` to retrieve a unique value instead of a possible array.

```js
Person.findOne(
  {
    favoriteFoods: "grapes",
  },
  (err, data) => {}
);
```

Use `Model.findById` to retrieve a value based on the identifier `_id` included automatically by MongoDB.

```js
const id = "12454645";
Person.findById(id, (err, data) => {});
```

#### crUd

Mongoose provides several helper methods. It is however possible to updte data by finding the specific document and saving a new instance. Search, edit and save.

```js
Person.findById(personId, (err, data) => {
  if (!err) {
    data.favoriteFoods.push(foodToAdd);
    data.save((err, data) => {});
  }
});
```

Use `Model.findOneAndUpdate` to find a specific document and update specific values.

```js
Person.findOneAndUpdate(
  {
    name: personName,
  },
  {
    age: ageToSet,
  },
  { new: true },
  (err, data) => {}
);
```

The third object allows to specify additional options. `new: true` instructs to mongoose to return the new document instead of the original, unmodified version.

#### cruD

Use `Model.findByIdAndRemove` to remove a document by id. Alternatively use `Model.findOneAndRemove` to remove one document matching the input object.

```js
Person.findByIdAndRemove(id, (err, data) => {});
```

Use `Model.remove` to remove multiple documents matching the selection.

```js
Person.remove(
  {
    name: "Gabriele",
  },
  (err, data) => {}
);
```

_Please note:_ the console highlights a deprecation warning, pointing to `Model.deleteOne` and `Model.deleteMany` in place of the remove methods.

#### Chain

Mongoose allows for more complex operations by chaining a series of functions. This is made possible by avoiding the callback function on the original `Model.method`.

```js
const query = Person.find({ name: "Gabriele" });
```

To execute the query and rely on the callback function call `exec()`.

```js
query.exec((err, data) => {
  done(null, data);
});
```

In the challenge the function is chained to the query after several options further detailing the search operation:

- find persons by food

- sort by name

- limit the documents to 2 instances

```js
const queryChain = (done) => {
  const foodToSearch = "burrito";
  const query = Person.find({ favoriteFoods: foodToSearch })
    .sort({ name: "asc" })
    .limit(2)
    .select("-age")
    .exec((err, data) => {
      done(null, data);
    });
};
```
