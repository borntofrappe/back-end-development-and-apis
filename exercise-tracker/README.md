# Exercise Tracker

Create an application similar [to the example Exercise Tracker](https://exercise-tracker.freecodecamp.rocks/).

## Links

- [Assignment](https://www.freecodecamp.org/learn/back-end-development-and-apis/back-end-development-and-apis-projects/exercise-tracker)

- [Solution](https://replit.com/@borntofrappe/boilerplate-project-exercisetracker)

## Assignment

The assignment asks to support several routes and methods.

### Create user

Create a new user with a unique `_id`

Request: `POST`

Path: `/api/users`

Payload: `username`

Response:

```json
{
  "username": "Gabriele",
  "_id": "61d21f02341a4005d2595479"
}
```

The `_id` from the assignment resembles that included by Mongoose when creating a document, but to get started without a database use either an incrementing integer or `Math.random()`

### Get users

Return an array of users

Request: `GET`

Path: `/api/users`

Response:

```json
[
  {
    "username": "Gabriele",
    "_id": "61d21f02341a4005d2595479"
  },
  {
    "username": "",
    "_id": ""
  }
]
```

### Create exercise

Create a new exercise for the selected user

Request: `POST`

Path: `/api/users/:_id/exercises`

Payload: `description`, `duration`, `date`

Response:

```json
{
  "_id": "61d21f02341a4005d2595479",
  "username": "Gabriele",
  "date": "Sun Jan 02 2022",
  "duration": 35,
  "description": "Jogging"
}
```

The date is optional and defaults to the current date. Include the value in the `date` field with the `dateString` format.

### Get exercises

Return an object describing the exercises for the selected user.

Request: `GET`

Path: `/api/users/:_id/logs`

Response:

```json
{
  "_id": "61d21f02341a4005d2595479",
  "username": "Timothy",
  "count": 2,
  "log": [
    { "description": "Jogging", "duration": 35, "date": "Sun Jan 02 2022" },
    { "description": "Trekking", "duration": 60, "date": "Fri Dec 31 2021" }
  ]
}
```

The `count` describes the number of exercises. `count` and `duration` should be numbers. `date` should be a string formatted with `dateString`.

### Get exercises in range

Return an object describing the exercises for the selected user and specific conditions.

Request: `GET`

Path: `/api/users/:_id/logs?from=from&to=to&limit=limit`

Response: the same for the `GET` request retrieving all entries, adapted to the input parameters.

```json
{
  "_id": "61d21f02341a4005d2595479",
  "username": "Timothy",
  "count": 1,
  "log": [
    { "description": "Jogging", "duration": 35, "date": "Sun Jan 02 2022" }
  ]
}
```

Parameters are optional. `from` and `to` are dates in `yyyy-mm-dd` format. `limit` is an integer.
