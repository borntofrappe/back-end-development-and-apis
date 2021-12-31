# Request Header Parser Microservice

Create an application similar [to the example Request Header Parser Microservice](https://request-header-parser-microservice.freecodecamp.rocks/)

## Links

- [Assignment](https://www.freecodecamp.org/learn/apis-and-microservices/apis-and-microservices-projects/request-header-parser-microservice)

- [Solution](https://replit.com/@borntofrappe/boilerplate-project-headerparser)

## Notes

The assignment asks to respond to a request to `/api/whoami` with a JSON object analysing the request itself. The object should describe:

- the IP address in the `ipaddress` key

- the preferred language in the `language` key

- the software in the `software` key

The request object points to the necessary information.

```js
app.get("/api/whoami", function (req, res) {
  console.log(req);
});
```

In the sizeable object consider the `headers` field:

```js
app.get("/api/whoami", function (req, res) {
  console.log(req.headers);
});
```

Here it is possible to find the desired values:

| Data       | Field               |
| ---------- | ------------------- |
| IP address | `x-forwarded-for`   |
| Language   | `accepted-language` |
| Software   | `user-agent`        |
