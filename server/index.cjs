const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");

let access_token = "";
let refresh_token = "";

const port = 5000;

dotenv.config();

let spotify_id = "shr4yhlvorob9kwnv8uy1a6z4";
let spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
let spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;
let ip = process.env.HOST_IP;

let app = express();

//TODO: get through file
let website_url = "http://localhost:3000";

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
        //TODO: decrease context,
        access_token = response.data.access_token;
        refresh_token = response.data.refresh_token;
        res.redirect(
          `/?access_token=${access_token}&refresh_token=${refresh_token}`,
        );
      }
    })
    .catch((error) => {
      if (error.response) {
        console.log(error);
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

app.get("/spotify/getTrackHistory", async function (_, res) {
  res.json(await fetchWebApi("v1/me/player/recently-played?limit=10", "GET"));
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

  if (res.status == 401) {
    // refresh token (expires each hour)
    await getToken(true);
  } else {
    if (res.status >= 300) {
      console.log("oops");
    } else if (hasJSON) {
      return await res.json();
    } else {
      return "";
    }
  }
}

async function getToken(refresh = false) {
  if (refresh) {
    open("/auth/login", "_self");
  }
  const response = await fetch("/auth/token");
  const json = await response.json();
  this.token = json.access_token;
  return json.access_token;
}

//function refreshToken() {
//  let authOptions = {
//    url: "https://accounts.spotify.com/api/token",
//    headers: {
//      "content-type": "application/x-www-form-urlencoded",
//      Authorization:
//        "Basic " +
//        new Buffer.from(
//          spotify_client_id + ":" + spotify_client_secret,
//        ).toString("base64"),
//    },
//    form: {
//      grant_type: "refresh_token",
//      refresh_token: refresh_token,
//    },
//    json: true,
//  };
//
//  axios(authOptions).then((response) => {
//    if (response.status === 200) {
//      access_token = response.data.access_token;
//      refresh_token = response.data.refresh_token;
//    }
//  });
//}
