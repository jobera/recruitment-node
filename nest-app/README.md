# Recruiment-node application

This project runs a NestJS application.

Once it's started, it'll run on `http://localhost:3000`.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test
```

## Endpoints

- [GET] `/api/v1/auth/login`: Used to authenticate user. Request example:

```
curl --request POST \
  --url http://localhost:3000/api/v1/auth/login \
  --header 'Content-Type: application/json' \
  --data '{
	"email": "user-1@example.com",
	"password": "password1"
}'
```

An object containing `accessToken` attribute is returned and it can be used to request owned certificates and/or transfer user certificates.

- [GET] `/api/v1/certificates`: Used to get carbon certificates. Request example:

```
curl --request GET \
  --url 'http://localhost:3000/api/v1/certificates' \
  --header 'Authorization: Bearer ACCESS_TOKEN' \
  --header 'Content-Type: application/json'
```

It should return all `available` carbon certificates by default. This endpoint accepts parameters to return owned certificates. Request example:

```
curl --request GET \
  --url 'http://localhost:3000/api/v1/certificates?status=owned' \
  --header 'Authorization: Bearer ACCESS_TOKEN' \
  --header 'Content-Type: application/json'
```

- [POST] `/api/v1/certificates/transfer`: Used to transfer carbon certificates ownership. Request example:

```
curl --request POST \
  --url http://localhost:3000/api/v1/certificates/transfer \
  --header 'Authorization: Bearer ACCESS_TOKEN' \
  --header 'Content-Type: application/json' \
  --data '{
	"userId": 2,
	"certificateId": 4
}'
```
