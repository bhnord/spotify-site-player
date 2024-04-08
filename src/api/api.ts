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

  async #fetchWebApi(endpoint: string, method: string) {
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      method,
    });

    if (res.status == 401) {
      // refresh token (expires each hour)
      await this.getToken(true);
    } else {
      return await res.json();
    }
  }

  async getTopTracks(top: number) {
    // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
    return (
      await this.#fetchWebApi(
        `v1/me/top/tracks?time_range=long_term&limit=${top}`,
        "GET",
      )
    ).items;
  }

  async getTrackHistory() {
    return (
      await this.#fetchWebApi("v1/me/player/recently-played?limit=10", "GET")
    ).items;
  }
}

export default new api();
