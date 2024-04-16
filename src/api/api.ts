export type Artist = {
  name: string;
};

class api {
  token = "";

  async getToken(refresh: boolean = false) {
    if (refresh) {
      open("/auth/login", "_self");
    }
    const response = await fetch("/auth/token");
    const json = await response.json();
    this.token = json.access_token;
    return json.access_token;
  }

  async #fetchWebApi(
    endpoint: string,
    method: string,
    hasJSON: boolean = true,
    body: string = "",
  ) {
    const url = `https://api.spotify.com/${endpoint}`;
    const req = {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      method,
    };

    if (body != "") {
      req.body = body;
    }
    const res = await fetch(url, req);

    if (res.status == 401) {
      // refresh token (expires each hour)
      await this.getToken(true);
    } else {
      if (res.status >= 300) {
        throw new Error(res.status + "");
      } else if (hasJSON) {
        return await res.json();
      } else {
        return "";
      }
    }
  }

  async getTopTracks(top: number, time_range: number) {
    // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
    const range =
      time_range === 0
        ? "short_term"
        : time_range === 1
          ? "medium_term"
          : "long_term";
    return (
      await this.#fetchWebApi(
        `v1/me/top/tracks?time_range=${range}&limit=${top}`,
        "GET",
      )
    ).items;
  }

  async getTrackHistory() {
    return (
      await this.#fetchWebApi("v1/me/player/recently-played?limit=10", "GET")
    ).items;
  }

  async transferPlayback(ids: string[]) {
    return await this.#fetchWebApi(
      "v1/me/player",
      "PUT",
      false,
      JSON.stringify({ device_ids: ids }),
    );
  }

  async pause() {
    return await this.#fetchWebApi("v1/me/player/pause", "PUT", false);
  }

  async play(context_uri: string = "") {
    if (context_uri === "") {
      return await this.#fetchWebApi("v1/me/player/play", "PUT", false);
    } else {
      return await this.#fetchWebApi(
        "v1/me/player/play",
        "PUT",
        false,
        JSON.stringify({ uris: [context_uri] }),
      );
    }
  }

  async togglePlay() {
    try {
      const res = await this.#fetchWebApi("v1/me/player", "GET");
      res.is_playing ? this.pause() : this.play();
    } catch {
      console.error("no playback");
    }
  }

  async skipToNext() {
    return await this.#fetchWebApi("v1/me/player/next", "POST", false);
  }
  async skipToPrevious() {
    return await this.#fetchWebApi("v1/me/player/previous", "POST", false);
  }
}

export default new api();
