export type Artist = {
  name: string;
};

class api {
  token: string = "";
  refreshToken: string = "";

  serverSock = import.meta.env.VITE_SERVER_SOCK;

  getToken() {
    open(this.serverSock + "/auth/login", "_self");
  }

  async #fetchWebApi(
    endpoint: string,
    method: string,
    body: string = "",
  ): Promise<string> {
    //user is not logged in
    if (this.token === "") {
      return "";
    }
    const url = `https://api.spotify.com/${endpoint}`;
    const req = {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      method,
      body,
    };

    const res = await fetch(url, req);

    if (res.status == 401) {
      // refresh token (expires each hour)
      console.log("refreshing token");
      this.getToken();
      //return await this.#fetchWebApi(endpoint, method, body);
      return "";
    } else {
      if (res.status >= 300) {
        throw new Error(res + "");
      } else {
        return "";
      }
    }
  }

  async #fetchServerApi(endpoint: string) {
    const url = this.serverSock + endpoint;
    const res = (await fetch(url)).json();
    return res;
  }

  async getTopTracks(top: number, time_range: number) {
    const range =
      time_range === 0
        ? "short_term"
        : time_range === 1
          ? "medium_term"
          : "long_term";
    return (
      await this.#fetchServerApi(
        `/spotify/getTopTracks?time_range=${range}&limit=${top}`,
      )
    ).items;
  }

  async getTrackHistory(limit: number = 10) {
    return (
      await this.#fetchServerApi(`/spotify/getTrackHistory?limit=${limit}`)
    ).items;
  }

  async transferPlayback(ids: string[]) {
    return await this.#fetchWebApi(
      "v1/me/player",
      "PUT",
      JSON.stringify({ device_ids: ids }),
    );
  }

  async pause() {
    return await this.#fetchWebApi("v1/me/player/pause", "PUT");
  }

  async play(uri: string = "") {
    if (uri === "") {
      return await this.#fetchWebApi("v1/me/player/play", "PUT");
    } else {
      return await this.#fetchWebApi(
        "v1/me/player/play",
        "PUT",
        JSON.stringify({ uris: [uri] }),
      );
    }
  }

  async playContext(context_uri) {
    return await this.#fetchWebApi(
      "v1/me/player/play",
      "PUT",
      JSON.stringify({ context_uri: context_uri }),
    );
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
    return await this.#fetchWebApi("v1/me/player/next", "POST");
  }

  async skipToPrevious() {
    return await this.#fetchWebApi("v1/me/player/previous", "POST");
  }

  async getPlaylistsResp(limit: number, offset: number) {
    return await this.#fetchServerApi(
      `/spotify/getPlaylists?limit=${limit}&offset=${offset}`,
    );
  }

  async getLikedSongsResp(limit: number, offset: number) {
    return await this.#fetchServerApi(
      `/spotify/getLikedSongs?limit=${limit}&offset=${offset}`,
    );
  }

  async addToQueue(uri: string) {
    return await this.#fetchWebApi(`v1/me/player/queue?uri=${uri}`, "POST");
  }

  async getAvailableDevices() {
    return await this.#fetchWebApi(`v1/me/player/devices`, "GET");
  }
}

export default new api();
