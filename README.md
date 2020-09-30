# Github Web Scraper

by Eduardo Rosostolato

## Description

A github web scraper api that return files with size in bytes and number of lines.

available on heroku: https://github-repository-summary.herokuapp.com/

> note: heroku server has a timeout limit of 30 seconds, so it will only work with small repositories.

## Example

```json
GET /rosostolato/curriculum

[
    {
        "extension": "svg",
        "lines": 4,
        "size": 1881
    },
    {
        "extension": "png",
        "lines": null,
        "size": 85197
    },
    {
        "extension": "others",
        "lines": 21,
        "size": 1065
    },
    {
        "extension": "md",
        "lines": 2,
        "size": 35
    },
    {
        "extension": "ico",
        "lines": null,
        "size": 606
    },
    {
        "extension": "html",
        "lines": 376,
        "size": 16282
    },
    {
        "extension": "css",
        "lines": 34,
        "size": 520
    }
]
```

## Reference

```
GET /:user/:repository?branch='master'&groupBy='extension'

user: string        - repository owner
repository: string  - repository name
branch: string      - repository branch, master as default
groupBy: string     - group by 'extension' or 'file', 'extension' as default
```


## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## License

[MIT licensed](LICENSE).
