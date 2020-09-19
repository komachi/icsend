# ![icsend](./assets/icon.svg) icsend


**Docs:** [FAQ](docs/faq.md), [Encryption](docs/encryption.md), [Build](docs/build.md), [Docker](docs/docker.md), [More](docs/)

---

## Table of Contents

* [What it does](#what-it-does)
* [Requirements](#requirements)
* [Development](#development)
* [Commands](#commands)
* [Configuration](#configuration)
* [Localization](#localization)
* [Contributing](#contributing)
* [Testing](#testing)
* [Deployment](#deployment)
* [License](#license)

---

## What it does

A file sharing experiment which allows you to send encrypted files to other users.

---

## About icsend

Most of it's source code taken from abandoned Mozilla project [Firefox Send](https://github.com/mozilla/send), so basically icsend is a [fork](https://en.wikipedia.org/wiki/Fork_(software_development)) of Firefox Send. We greatly thanks for contributors to original project, and we will try to make your work get continued support.

Key difference between icsend and Firefox Send is that icsend targets mostly self-hosting approach. Most of the code related to tracking metrics, analytics and Firefox Account are removed.

It's currently in early stage of forking and adapting to new use case, so use it with care.

---

## Requirements

- [Node.js 12.x](https://nodejs.org/)
- [Redis server](https://redis.io/) (optional for development)
- [AWS S3](https://aws.amazon.com/s3/) or compatible service (optional)

---

## Development

To start an ephemeral development server, run:

```sh
npm install
npm start
```

Then, browse to http://localhost:1337

---

## Commands

| Command          | Description |
|------------------|-------------|
| `npm run format` | Formats the frontend and server code using **prettier**.
| `npm run lint`   | Lints the CSS and JavaScript code.
| `npm test`       | Runs the suite of mocha tests.
| `npm start`      | Runs the server in development configuration.
| `npm run build`  | Builds the production assets.
| `npm run prod`   | Runs the server in production configuration.

---

## Configuration

The server is configured with environment variables. See [server/config.js](server/config.js) for all options and [docs/docker.md](docs/docker.md) for examples.

---

## Localization

see [docs/localization.md](docs/localization.md)

---

## Contributing

Pull requests are always welcome!
---


## Deployment

see also [docs/deployment.md](docs/deployment.md)

---

## License

[Mozilla Public License Version 2.0](LICENSE)

---
