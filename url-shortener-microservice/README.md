# URL Shortener Microservice

Create an application similar [to the example URL Shortener Microservice](https://url-shortener-microservice.freecodecamp.rocks/)

## Links

- [Assignment](https://www.freecodecamp.org/learn/back-end-development-and-apis/back-end-development-and-apis-projects/url-shortener-microservice)

- [REPL](https://replit.com/@borntofrappe/boilerplate-project-urlshortener)

## Assignment

> You can POST a URL to `/api/shorturl` and get a JSON response with `original_url` and `short_url` properties

    ```json
    {
      "original_url": "https://freeCodeCamp.org",
      "short_url": 1
    }
    ```

> When you visit `/api/shorturl/<short_url>`, you will be redirected to the original URL

> If you pass an invalid URL that doesn't follow the valid format, the JSON response will contain `{ "error": "invalid url" }`
