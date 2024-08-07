const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");

const port = 5000;

dotenv.config();

let spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
let spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;
let ip = process.env.HOST_IP;

let app = express();

let access_token = "";
let refresh_token = "";

app.get("/auth", (_, res) => {
  res.redirect("https://google.com");
});

app.get("/auth/login", (_, res) => {
  var scope =
    "streaming \
     user-read-email \
     user-read-private \
     user-top-read \
     user-modify-playback-state \
     user-read-playback-state \
     user-read-recently-played \
     user-library-read";

  var state = generateRandomString(16);

  var auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: spotify_client_id,
    scope: scope,
    redirect_uri: `http://${ip}:3000/auth/callback`,
    state: state,
  });

  res.redirect(
    "https://accounts.spotify.com/authorize/?" +
      auth_query_parameters.toString(),
  );
});

app.get("/auth/callback", (req, res) => {
  var code = req.query.code;

  var authOptions = {
    method: "POST",
    url: "https://accounts.spotify.com/api/token",
    data: {
      code: code,
      redirect_uri: `http://${ip}:3000/auth/callback`,
      grant_type: "authorization_code",
    },
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(spotify_client_id + ":" + spotify_client_secret).toString(
          "base64",
        ),
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  axios(authOptions)
    .then((response) => {
      if (response.status === 200) {
        access_token = response.data.access_token;
        refresh_token = response.data.refresh_token;
        res.redirect("/");
      }
    })
    .catch((error) => {
      if (error.response) {
        console.log(error);
      }
    });
});

app.get("/auth/token", (_, res) => {
  //add option to refresh token
  res.json({
    access_token: access_token,
  });
});

//TODO: Test Function
app.get("/auth/refresh_token", function (_, res) {
  let authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        new Buffer.from(
          spotify_client_id + ":" + spotify_client_secret,
        ).toString("base64"),
    },
    form: {
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    },
    json: true,
  };

  axios(authOptions).then((response) => {
    if (response.status === 200) {
      access_token = response.data.access_token;
      refresh_token = response.data.refresh_token;
      res.send({ access_token: access_token });
    }
  });
});

app.listen(port, () => {
  console.log(`Listening at http://${ip}:${port}`);
});

const generateRandomString = function (length) {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};
