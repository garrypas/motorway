# Motorway Pre-interview
===

## Overview

This repo exists for the purposes of returning car prices.

This uses:

NodeJS for application code
Docker to run the app
Redis as a cache
Docker compose to containerize the app for e2e testing as well as Redis and Mountebank (used for over-the-wire API stubs).
Express to expose our service to the outside world

## Pre-requisites

* NodeJS 16.13.1 or higher (lts-buster)
* Docker 20x or higher

## Setup

```javascript
npm i
```

## Run tests

Unit tests

```
npm t
```

End-to-end tests
```
docker-compose up
```
Then
```
npm run e2e
```

This will execute tests that will ensure the components integrate correctly with each-other and mocked external dependencies.

## Run app

Environment variables
```
REDIS_URL
REDIS_PORT
THIRD_PARTY_URL
THIRD_PARTY_PORT
```

## ToDos

* In a real app I'd also add some logging to capture key events for diagnostics, perhaps to file or just using a wrapper around console.log (if running in, for example, AWS)

* Some sort of authentication and authorisation on the express endpoint, requiring a bearer token or similar approach

* Given more time I'd clean up the end-to-end tests, put the files in a subfolder, perhaps test a few more scenarios.