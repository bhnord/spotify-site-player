# Spotify Web Player

## Setup

### Set up your .env file

add these six variables to your .env file:

```env
SPOTIFY_ID
SPOTIFY_CLIENT_ID
SPOTIFY_CLIENT_SECRET
SERVER_URL
CLIENT_URL
PORT
```

you can use `SERVER_URL=http://localhost` and `CLIENT_URL=http://localhost` if you are running locally

### Set up your .tokens.json file

1. create a .tokens.json file in the root directory containing `{}`
2. change requested scopes in index.cjs /auth/login to the
   server scopes commented above the function
3. run using `yarn dev`
4. login with spotify and allow access to the app
5. copy the new url with the access_token and refresh_token
6. paste these in .tokens.json like so:

```json
{
  "access_token": "<access_token>",
  "refresh_token": "<refresh_token>"
}
```

## Develop

run server and webapp with `yarn dev`

run server only with `yarn server`

run webapp only with `yarn webapp`
