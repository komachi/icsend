## Setup

Run `docker build -t icsend .` to create an image or `docker-compose up` to run a full testable stack. *We don't recommend using docker-compose for production.*

## Environment variables:

| Name             | Description
|------------------|-------------|
| `PORT`           | Port the server will listen on (defaults to 1443).
| `S3_BUCKET`  | The S3 bucket name.
| `REDIS_HOST` | Host name of the Redis server.
| `MAX_FILE_SIZE` | in bytes (defaults to 2147483648)
| `NODE_ENV`       | "production"
| `BASE_URL`       | The HTTPS URL where traffic will be served (e.g. `https://example.com`)

## Example:

```sh
$ docker run --net=host -e 'NODE_ENV=production' \
  -e 'S3_BUCKET=testpilot-p2p-dev' \
  -e 'REDIS_HOST=dyf9s2r4vo3.bolxr4.0001.usw2.cache.amazonaws.com' \
  -e 'BASE_URL=https://example.com' \
  icsend
```
