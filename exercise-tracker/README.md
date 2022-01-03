# Exercise Tracker

Create an application similar [to the example Exercise Tracker](https://exercise-tracker.freecodecamp.rocks/).

## Links

- [Assignment](https://www.freecodecamp.org/learn/back-end-development-and-apis/back-end-development-and-apis-projects/exercise-tracker)

- [Solution](https://replit.com/@borntofrappe/boilerplate-project-exercisetracker)

- [Solution without a database](https://replit.com/@borntofrappe/boilerplate-project-exercisetracker-nodb)

## Notes

The assignment asks to support several routes and methods.

| Route                       | Method | Payload                           | Response                                                                  |
| --------------------------- | ------ | --------------------------------- | ------------------------------------------------------------------------- |
| `/api/users`                | POST   | `username`                        | `{ username, _id }`                                                       |
| `/api/users`                | GET    |                                   | `[{ username, _id }, {...}]`                                              |
| `/api/users/:_id/exercises` | POST   | `description`, `duration`, `date` | `{ _id, username, date, duration, description }`                          |
| `/api/users/:_id/logs`      | GET    |                                   | `{ _id, username, count, log: [{ date, duration, description }, {...}] }` |

Similarly to the [url shortener microservice](https://github.com/borntofrappe/back-end-development-and-apis/tree/master/url-shortener-microservice) I decided to first implement the project without a database, then repurpose the application with MongoDB and Mongoose.

### Create user

Concerning the post request to `/api/users` start by extracting the `username` from the request's body.

```js
const { username } = req.body;
```

Remember to install and initialize `body-parser` to populate the object.

```js
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
```

After creating and saving the user return a JSON object with the `_id` and `username` fields.

```js
res.json({
  username,
  _id,
});
```

With a database create a user from the model (described in a later section) and save the instance with the `.save` method.

### Get users

For the get request to `/api/users` begin by finding all users, then return an array of objects with the `username` and `_id` fields.

With a database pass an empty object to the `.find` query, so to find _all_ documents from the model.

```js
User.find({});
```

Chain the `select` function to limit the information to the desired fields.

```js
User.find({}).select("username");
```

The `_id` is automatically included.

### Create exercise

For the post request to `/api/users/:_id/exercises` extract the identifier from the route parameters, the description, duration and date from the request's body.

Find the user with a matching `_id` and append the exercise to the user's log. Finally, return a JSON object highlighting the prescribed fields.

```json
{
  _id,
  username,
  date: date.toDateString(),
  duration,
  description
}
```

The assignment asks to format the date specifically with `toDateString()`.

In terms of mongoose it seems the default value for the date is not used when the model receives `null`. Pass `undefined` instead.

```js
const exercise = new Exercise({
  // ..
  date: date || undefined,
});
```

When finding a user through the `findById` query it seems it is enough to then save the user document to store the exercise, the sub-document, as well.

### Get exercises

For the get request to `/api/users/:_id/logs` find the user with the same `_id` retrieved through the route parameter. For this user return an object with a log of exercises.

```json
{
  _id,
  username,
  count,
  log: []
}
```

For the log sort the exercises by date.

```js
let log = [...data.log].sort((a, b) => b.date - a.date);
```

Use `let` to potentially modify the data structure through the query parameters. As per the assignment, the request can be refined with three options: `to`, `from` and `limit`.

Use `limit` to include only the prescribed number of exercises in the log.

```js
if (limit) {
  log = log.slice(0, limit);
}
```

Use `to` and/or `from`, two strings in `yyyy-mm-dd` format, to show only the exercises up to and/or from the input values.

```js
if (from) {
  log = log.filter((d) => d.date > new Date(from));
}

if (to) {
  log = log.filter((d) => d.date < new Date(to));
}
```

### Mongoose schemas

The application relies on two schemas, one for the user and one for the exercise. It is actually possible to use the exercise in the definition of the user schema, so to ensure that the document receives an array of exercises.

```js
const userSchema = new mongoose.Schema({
  log: {
    type: [exerciseSchema],
    default: [],
  },
});
```

For the `date` field of the exercise schema set a default value for the current date.

```js
const exerciseSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: new Date(),
  },
});
```

As noted in an earlier section, the value is included when the field is not defined.
