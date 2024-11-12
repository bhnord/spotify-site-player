# Spotify Web Player

## Setup

### Set up your .env file

add these six variables to your .env file:

```env
SPOTIFY_ID                #spotify id of your user
SPOTIFY_CLIENT_ID         #client id of your spotify app
SPOTIFY_CLIENT_SECRET     #client secret of your spotify app
SERVER_IP                 #ip of your server
PORT                      #port you want your server to run on
CLIENT_URL                #url where your webapp is hosted
VITE_SERVER_SOCK          #<ip>:<port> of where your server is hosted
```

see [create a spotify app](https://developer.spotify.com/documentation/web-api/concepts/apps)

you can use `SERVER_IP=http://localhost` and `CLIENT_URL=http://localhost:3000` if you are running locally

the only env required by the webapp is VITE_SERVER_SOCK

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
