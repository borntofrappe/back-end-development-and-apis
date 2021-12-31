# Timestamp Microservice

Create an application similar [to the example Timestamp Microservice](https://timestamp-microservice.freecodecamp.rocks/)

## Links

- [Assignment](https://www.freecodecamp.org/learn/back-end-development-and-apis/back-end-development-and-apis-projects/timestamp-microservice)

- [Solution](https://replit.com/@borntofrappe/boilerplate-project-timestamp)

## Notes

The goal of the project is to provide a JSON object for a date, specifying the timestamp in milliseconds and a date in GMT format.

```json
{
  "unix": "1451001600000",
  "utc": "Fri, 25 Dec 2015 00:00:00 GMT"
}
```

Considering the tests run on the project the microservice should focus on specific routes and query parameters:

- respond to a request to `/api` with the current date

  ```js
  app.get("/api", function (req, res) {
    res.json({
      unix: new Date().getTime(),
      utc: new Date().toGMTString(),
    });
  });
  ```

  `toGMTString()` provides the string in the desired format. `getTime()` retrieves the number of milliseconds since Unix Epoch

- respond to a request to `/api/:date` with a date according to the query parameter

  The logic is here slightly complicated by the fact that the query parameter might create an invalid date, and by the fact the value might be a number of milliseconds or a date string.

  With a valid date string the date object is created directly passing the query parameter to the `new Date()` constructor.

  ```js
  const date = new Date(req.params.date);
  ```

  With a number of milliseconds the constructor requires the value as a number, not a string.

  ```js
  const date = new Date(parseInt(req.params.date, 10));
  ```

  When a date is created return the JSON object with the desired fields.

  ```js
  res.json({
    unix: date.getTime(),
    utc: date.toGMTString(),
  });
  ```

  When it's not possible to create a valid date as in the two instances return a JSON object hihglighting the situation.

  ```js
  res.json({
    error: "Invalid Date",
  });
  ```

## Local development

Completing the project locally requires cloning the [provided GitHub repository](https://github.com/freeCodeCamp/boilerplate-project-timestamp/). From this starting point it is necessary to:

1. install the necessary packages:

   ```bash
   npm install
   ```

2. set up the routes in `server.js`

   ```js
   app.get("/api", function (req, res) {});
   app.get("/api/:date", function (req, res) {});
   ```

3. run the project

   ```bash
   npm run start
   ```
