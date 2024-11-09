const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");
const fs = require("fs");

const port = 5000;
const TOKENS_FILE = ".tokens.json";

dotenv.config();

let spotify_id = "shr4yhlvorob9kwnv8uy1a6z4";
let spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
let spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;
let website_url = process.env.WEBSITE_URL;
let ip = process.env.HOST_IP;

let access_token = "";
let refresh_token = "";

readTokens();

let app = express();

app.use(function (_, res, next) {
  res.setHeader("Access-Control-Allow-Origin", website_url);
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type",
  );
  next();
});

app.get("/auth", (_, res) => {
  res.redirect("https://google.com");
});

//server scopes
//     "user-read-email \
//     user-read-private \
//     user-top-read \
//     user-read-recently-played \
//     user-library-read";

app.get("/auth/login", (_, res) => {
  var scope =
    "streaming \
     user-modify-playback-state \
     user-read-currently-playing \
     user-read-playback-state";

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
        let access_token = response.data.access_token;
        let refresh_token = response.data.refresh_token;
        res.redirect(
          `/?access_token=${access_token}&refresh_token=${refresh_token}`,
        );
      }
    })
    .catch((error) => {
      if (error.response) {
        console.error(error);
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

app.get("/spotify/getTrackHistory", async function (req, res) {
  const limit = req.query.limit || 10;
  res.json(
    await fetchWebApi(`v1/me/player/recently-played?limit=${limit}`, "GET"),
  );
});

app.get("/spotify/getPlaylists", async function (req, res) {
  const limit = req.query.limit || 1;
  const offset = req.query.offset || 0;

  res.json(
    await fetchWebApi(
      `v1/users/${spotify_id}/playlists?limit=${limit}&offset=${offset}`,
      "GET",
    ),
  );
});

app.get("/spotify/getLikedSongs", async function (req, res) {
  const limit = req.query.limit || 1;
  const offset = req.query.offset || 0;

  res.json(
    await fetchWebApi(`v1/me/tracks?limit=${limit}&offset=${offset}`, "GET"),
  );
});

app.get("/spotify/getTopTracks", async function (req, res) {
  const time_range = req.query.time_range;
  const limit = req.query.limit;
  res.json(
    await fetchWebApi(
      `v1/me/top/tracks?time_range=${time_range}&limit=${limit}`,
      "GET",
    ),
  );
});

async function fetchWebApi(endpoint, method, hasJSON = true, body = "") {
  const url = `https://api.spotify.com/${endpoint}`;
  const req = {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    method,
  };

  if (body != "") {
    req.body = body;
  }
  const res = await fetch(url, req);

  if (res.status == 401 || res.status == 405) {
    // refresh token and retry
    await refreshToken();
    return await fetchWebApi(endpoint, method, hasJSON, body);
  } else {
    if (res.status >= 300) {
      refreshToken();
    } else if (hasJSON) {
      return await res.json();
    } else {
      return "";
    }
  }
}

async function refreshToken() {
  let authOptions = {
    method: "POST",
    url: "https://accounts.spotify.com/api/token",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        new Buffer.from(
          spotify_client_id + ":" + spotify_client_secret,
        ).toString("base64"),
    },
    data: {
      grant_type: "refresh_token",
      refresh_token: refresh_token,
      client_id: spotify_client_id,
    },
    json: true,
  };

  try {
    let response = await axios(authOptions);
    if (response.status === 200) {
      access_token = response.data.access_token;
      if ("refresh_token" in response.data) {
        refresh_token = response.data.refresh_token;
      }
      console.log("refreshed tokens");
      writeTokens();
    } else {
      console.error("failed to refresh token");
    }
  } catch (err) {
    console.error("failed to refresh token");
    console.error(err);
  }
}

function readTokens() {
  try {
    const data = JSON.parse(fs.readFileSync(TOKENS_FILE));

    access_token = data.access_token;
    refresh_token = data.refresh_token;
  } catch (err) {
    console.error("Error reading tokens from file");
    console.error(err);
  }
}

function writeTokens() {
  try {
    const data = {
      access_token: access_token,
      refresh_token: refresh_token,
    };
    const jsonData = JSON.stringify(data);
    fs.writeFileSync(TOKENS_FILE, jsonData);
    console.log("wrote new tokens to file");
  } catch (err) {
    console.error("Error writing tokens to file");
  }
}
